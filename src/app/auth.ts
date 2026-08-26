const USERS_KEY   = "yaptopia_users";
const SESSION_KEY = "yaptopia_session";

export type Role = "castaway" | "navigator";

export interface YapUser {
  name:     string;
  email:    string;
  password: string;
  role:     Role;
}

function getUsers(): YapUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

/** Returns null on success, or an error string. */
export function registerUser(
  name: string, email: string, password: string, role: Role,
): string | null {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return "A castaway with that email already exists.";
  }
  users.push({ name, email, password, role });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return null;
}

/** Returns the user on success, or null on failure. */
export function loginUser(email: string, password: string): YapUser | null {
  const user = getUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function getCurrentUser(): YapUser | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}
