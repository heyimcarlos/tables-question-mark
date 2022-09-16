import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export enum ErrorCode {
  UserNotFound = "user-not-found",
  IncorrectPassword = "incorrect-password",
  UserMissingPassword = "missing-password",
  InternalServerError = "internal-server-error",
  NewPasswordMatchesOld = "new-password-matches-old",
}

export enum SuccessCode {
  UserSignedIn = "user-signed-in",
  UserSignedOut = "user-signed-out",
}
