// Objectif de cette fonction, créer un slug pour un produit : 
// "Play Station 5 500Go Light à petit prix" --> "play-station-5-500go-light-à-petit-prix"

export function buildSlug(sentence: string): string {
  return sentence.toLowerCase().split(" ").join("-");
}

// Exercice TEST UNITAIRES : 
// - implémenter cette fonction
// - implémenter 1-2 tests pour vérifier le bon fonctionnement de celle-ci


// Bonus : 
// - remplacer également les caractères spéciaux : à -> a
// - et le test associé !

