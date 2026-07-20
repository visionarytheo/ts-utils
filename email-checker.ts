import dns from "dns";
import { getErrorMessage } from "./error-message";

export async function checkMX(domain: string): Promise<dns.MxRecord[]> {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        if (err.code === "ENOTFOUND") {
          reject(new Error("DOMAIN_NOT_FOUND"));
        } else {
          reject(new Error("DNS_CHECK_UNAVAILABLE")); // transient — don't block signup on this
        }
      } else {
        resolve(addresses);
      }
    });
  });
}

export async function emailChecker(
  email: string,
): Promise<{ isValid: boolean; message: string }> {
  const domain = email.split("@")[1];
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
    return { isValid: true, message: "Email is valid." };
  } catch (err) {
    const message = getErrorMessage(err);

    if (message === "DOMAIN_NOT_FOUND") {
      return {
        isValid: false,
        message: "This email domain does not appear to exist.",
      };
    }

    // DNS_CHECK_UNAVAILABLE (or any other transient failure) — don't block signup
    return {
      isValid: true,
      message: "Could not verify domain right now; allowing signup.",
    };
  }
}
