export const validationsSession = async (to, from, next) => {
  const validation =
    localStorage.getItem("accessToken") && localStorage.getItem("email");
  if (!validation) {
    return next("/login");
  }
  next();
};

/**
 * Validate the user is logged in
 * */
export const validationNotSession = async (to, from, next) => {
  const validation =
    localStorage.getItem("accessToken") && localStorage.getItem("email");
  console.log(validation);
  if (validation) {
    return next("/");
  }
  next();
};
