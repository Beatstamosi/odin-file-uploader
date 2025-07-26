import { body } from "express-validator";

const capitalizeWords = (value: string) => {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const validateFolderName = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .customSanitizer(capitalizeWords),
];
