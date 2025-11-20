export function isComplexPassword(password: string): boolean {
  // Règles métiers

  // - Minimum 8 caractères (CNIL recommande 12)
  if (password.length < 8) {
    return false;
  }

  // - Au moins une majuscule
  if (! /[A-Z]/.test(password)) {
    return false;
  }

  // - Au moins une minuscule
  if (! /[a-z]/.test(password)) {
    return false;
  }

  // - Au moins un chiffre
  if (! /[0-9]/.test(password)) {
    return false;
  }

  // - Au moins un caractère spécial
  // [^...] = opposé de ...
  if (! /[^A-Za-z0-9]/.test(password)) {
    return false;
  }

  // Autre manière : on liste les caractères spéciaux acceptés
  // if (! /[!@#$%^&*]/.test(password)) {
  //   return false;
  // }

  return true;
}

// export function isComplexPassword(password: string): boolean {
//   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
//   return regex.test(password);
// }
