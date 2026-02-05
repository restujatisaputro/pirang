import { http } from "./http";

export const api = {
  getDatabase() {
    return http("/api/database");
  },
  login(username: string, password: string) {
    return http("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
};
