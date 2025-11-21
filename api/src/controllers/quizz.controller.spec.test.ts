import { describe, it } from "node:test";
import { prisma } from "../models/index.ts";
import assert from "node:assert";
import { adminRequester } from "../../test/index.ts";

// Test GET ALL
describe("[GET] /quizzes", () => {
  it("should return all quizzes", async () => {
    // ARRANGE
    const quizzes = await prisma.quiz.createManyAndReturn({
      data: [
        {
          name: "Harry Potter",
          description: "Testez vos connaissances sur la saga Harry POTTER !",
        },
        {
          name: "Newton",
          description: "",
        },
      ],
    });
    // ACT
    const { data: body } = await adminRequester.get("/quizzes");

    // ASSERT
    assert.deepStrictEqual(body, [
      {
        id: quizzes[0].id,
        name: quizzes[0].name,
        description: quizzes[0].description,
        created_at: quizzes[0].created_at.toISOString(),
        updated_at: quizzes[0].updated_at.toISOString(),
      },
      {
        id: quizzes[1].id,
        name: quizzes[1].name,
        description: quizzes[1].description,
        created_at: quizzes[1].created_at.toISOString(),
        updated_at: quizzes[1].updated_at.toISOString(),
      },
    ]);
  });
});

// Test GET by ID
describe("[GET] /quizzes/:id", () => {
  it("should return the requested quiz", async () => {
    // ARRANGE
    const createdQuiz = await prisma.quiz.create({
      data: {
        name: "Culture Générale",
        description: "Testez vos connaissances sur votre culture G !",
      },
    });

    // ACT
    const { status, data } = await adminRequester.get(
      `/quizzes/${createdQuiz.id}`
    );

    // ASSERT
    assert.equal(status, 200);
    assert.equal(data.id, createdQuiz.id);
    assert.equal(data.name, createdQuiz.name);
    assert.equal(data.description, createdQuiz.description);
  });
});

describe("[GET] /quizzes/recent", () => {
  it("should return the last 6 quizzes created", async () => {
    // ARRANGE - Créer 8 quiz avec une boucle
    const createdQuizzes = [];
    for (let i = 1; i <= 8; i++) {
      const quiz = await prisma.quiz.create({
        data: {
          name: `Quizz ${i}`,
          description: "Testez vos connaissances sur votre culture G !",
        },
      });
      createdQuizzes.push(quiz);
    }

    // ACT
    const { data } = await adminRequester.get(`/quizzes/recent`);

    // ASSERT
    assert.ok(data.length <= 6);

    // Vérifie que les 6 derniers quiz créés sont présents (quiz 3 à 8)
    const returnedIds = data.map((quiz: any) => quiz.id);
    for (let i = 2; i <= 7; i++) {
      assert.ok(returnedIds.includes(createdQuizzes[i].id));
    }

    // Vérifie que les quiz sont dans l'ordre décroissant par created_at (du plus récent au plus ancien)
    for (let i = 0; i < data.length - 1; i++) {
      const currentDate = new Date(data[i].created_at);
      const nextDate = new Date(data[i + 1].created_at);
      assert.ok(currentDate >= nextDate);
    }
  });
});

describe("[GET] /quizzes/:id/questions", () => {
  it("should return questions from the requested quiz", async () => {
    // ARRANGE
    const quiz1 = await prisma.quiz.create({
      data: {
        name: "Quiz Harry Potter",
        description: "Questions sur Harry Potter",
      },
    });
    const quiz2 = await prisma.quiz.create({
      data: {
        name: "Quiz Science",
        description: "Questions de science",
      },
    });

    // Créer 2 questions pour le quiz 1
    const question1Quiz1 = await prisma.question.create({
      data: {
        description: "Qui est le héro ?",
        quiz_id: quiz1.id,
      },
    });
    const question2Quiz1 = await prisma.question.create({
      data: {
        description: "Qui est l'antagoniste ?",
        quiz_id: quiz1.id,
      },
    });

    // Créer 2 questions pour le quiz 2
    const question1Quiz2 = await prisma.question.create({
      data: {
        description: "Qu'est-ce que la gravité ?",
        quiz_id: quiz2.id,
      },
    });
    const question2Quiz2 = await prisma.question.create({
      data: {
        description: "Qui a découvert le boson de Higgs ?",
        quiz_id: quiz2.id,
      },
    });

    // ACT
    const { status, data } = await adminRequester.get(
      `/quizzes/${quiz1.id}/questions`
    );

    // ASSERT
    assert.equal(status, 200);
    assert.equal(data.length, 2); // Seulement les questions du quiz 1

    // Vérifie que ce sont bien les questions du quiz 1
    const questionIds = data.map((q: any) => q.id);
    assert.ok(questionIds.includes(question1Quiz1.id));
    assert.ok(questionIds.includes(question2Quiz1.id));

    // Vérifie que les questions du quiz 2 ne sont PAS présentes
    assert.ok(!questionIds.includes(question1Quiz2.id));
    assert.ok(!questionIds.includes(question2Quiz2.id));
  });

  it("should return 404 when the quiz does not exist", async () => {
    // ARRANGE
    const unexistingQuizId = 999999;

    // ACT
    const { status, data } = await adminRequester.get(
      `/quizzes/${unexistingQuizId}/questions`
    );

    // ASSERT
    assert.equal(status, 404);
    assert.equal(data.error, "Quiz not found");
  });
});
