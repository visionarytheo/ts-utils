import { ZodError } from "zod";

export function getZodErrorMessage(error: ZodError): string {
  return (
    error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ") || "Invalid input data"
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return getZodErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong";
}

export function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return undefined;
}

