import { checkSchema } from "express-validator";

export const registerValidateSchema = checkSchema({
  name: {
    exists: {
      errorMessage: "User name is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "User name should be string" },
  },
  password: {
    exists: { errorMessage: "Password is required" },
    isString: { errorMessage: "password should be string" },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 characters",
    },
  },
  email: {
    isEmail: { errorMessage: "Please provide valid email" },
    exists: {
      errorMessage: "Email is required",
    },
  },
});
