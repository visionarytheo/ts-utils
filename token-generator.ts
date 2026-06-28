import { getVerificationTokenByEmail } from "@/server/users.server";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date().getTime() + 5 * 60; // 5 minutes

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationTokenByToken(existingToken?.token);
  }

  const verification_token = await addNewVerificationToken(
    email,
    token,
    new Date(expires),
  );

  return verification_token;
};
