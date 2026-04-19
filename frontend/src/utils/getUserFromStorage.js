function readUser() {
  try {
    return JSON.parse(localStorage.getItem("userInfo") || "null");
  } catch {
    return null;
  }
}

// bearer sent to api (access token)
export const getUserFromStorage = () => {
  const user = readUser();
  return user?.accessToken || user?.token || null;
};

// true if user should see protected routes (access or refresh still present)
export const hasAuthSession = () => {
  const user = readUser();
  return Boolean(user?.accessToken || user?.refreshToken || user?.token);
};
