const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Stockage du token en mémoire
let accessToken: string | null = null;

export const api = {
  login,
  logout,
  getMe,
  getUsers,
  isAuthenticated: () => accessToken !== null,
};

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export interface MeDTO {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export interface UserDTO {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

async function login(credentials: LoginDTO): Promise<MeDTO> {
  const httpResponse = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!httpResponse.ok) {
    const err = await httpResponse.json();
    throw new Error(err.error ?? "Identifiants incorrects");
  }

  const data: AuthResponseDTO = await httpResponse.json();
  accessToken = data.accessToken;

  return getMe();
}

async function logout(): Promise<void> {
  if (!accessToken) return;
  await fetch(`${apiBaseUrl}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  accessToken = null;
}

async function getMe(): Promise<MeDTO> {
  const httpResponse = await fetch(`${apiBaseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!httpResponse.ok) throw new Error("Non authentifié");
  return httpResponse.json();
}

async function getUsers(): Promise<UserDTO[]> {
  const httpResponse = await fetch(`${apiBaseUrl}/users`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!httpResponse.ok) {
    const err = await httpResponse.json();
    throw new Error(err.error ?? `Erreur ${httpResponse.status}`);
  }

  return httpResponse.json();
}
