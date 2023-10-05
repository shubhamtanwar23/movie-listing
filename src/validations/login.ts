import { checkSchema } from "express-validator";

export const loginValidateSchema = checkSchema({
  password: {
    exists: { errorMessage: "Password is required" },
  },
  email: {
    isEmail: { errorMessage: "Please provide valid email" },
    exists: {
      errorMessage: "Email is required",
    },
  },
});
