// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: { // On défini nos propres règles = au choix, selon l'équipe avec qui on travail
      'semi': ['error', 'always'], // ; obligatoire en fin d'instruction
      'indent': ['error', 2], // (Convetion JS) L'intentation du code doit être de 2 espaces
      '@typescript-eslint/no-explicit-any': 'off', // on autorise "any" partout pour se faciliter la vie en tant que débutant TypeScript
    },
  },
  {
    ignores: ["dist", "node_modules", "prisma/generated", "test/report"], // Dossiers qui ne seront pas analyser par ESLint
  }
);