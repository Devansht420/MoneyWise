import { http } from "../../utils/httpClient";

// login
export const loginAPI = async ({ email, password }) => {
  const { data } = await http.post("/users/login", { email, password });
  return data;
};

// register
export const registerAPI = async ({ email, password, username }) => {
  const { data } = await http.post("/users/register", {
    email,
    password,
    username,
  });
  return data;
};

// change password
export const changePasswordAPI = async (newPassword) => {
  const { data } = await http.put("/users/change-password", {
    newPassword,
  });
  return data;
};

// update profile
export const updateProfileAPI = async ({ email, username }) => {
  const { data } = await http.put("/users/update-profile", {
    email,
    username,
  });
  return data;
};
