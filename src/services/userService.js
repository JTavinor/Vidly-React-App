import http from "./httpService";
import userEvent from "@testing-library/user-event";

const apiEndpoint = "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name,
  });
}
