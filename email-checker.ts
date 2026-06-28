import dns from "dns";
import { getErrorMessage } from "./error-message";

// Function to check MX records for a domain
export async function checkMX(domain: string): Promise<dns.MxRecord[]> {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject(new Error("Failed to fetch MX records"));
      } else {
        resolve(addresses);
      }
    });
  });
}

// Main email checker function
export async function emailChecker(
  email: string,
): Promise<{ isValid: boolean; message: string }> {
  const domain = email.split("@")[1]; // Extract the domain part from the email

  if (!domain) {
    return {
      isValid: false,
      message: "Invalid email format. Please provide a valid email address.",
    };
  }

  try {
    const mxRecords = await checkMX(domain);

    if (mxRecords.length === 0) {
      return {
        isValid: false,
        message:
          "No MX records found for this domain. The email domain may not be valid.",
      };
    }

    return { isValid: true, message: "Email is valid." }; // Email is valid if it has MX records
  } catch (err) {
    // Return a user-friendly error message
    return {
      isValid: false,
      message:
        getErrorMessage(err) ||
        "An unexpected error occurred during validation.",
    };
  }
}
