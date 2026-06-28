import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { getErrorMessage } from "./error-message";

interface CountryPhoneCodes {
  name: string;
  dialCode: string;
  code: string;
  flag: string;
}

export const countryPhoneCodes: CountryPhoneCodes[] = [
  { name: "Lesotho", dialCode: "+266", code: "LS", flag: "🇱🇸" },
  { name: "South Africa", dialCode: "+27", code: "ZA", flag: "🇿🇦" },
  { name: "Botswana", dialCode: "+267", code: "BW", flag: "🇧🇼" },
  { name: "Zimbabwe", dialCode: "+263", code: "ZW", flag: "🇿🇼" },
  { name: "Namibia", dialCode: "+264", code: "NA", flag: "🇳🇦" },
  { name: "Swaziland", dialCode: "+268", code: "SZ", flag: "🇸🇿" },
];

const phoneUtil = PhoneNumberUtil.getInstance();

export function normalizePhoneNumber(
  phone: string,
  countryCode: string,
): string {
  try {
    // Parse and validate the phone number
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phone, countryCode);

    // Check if the number is valid
    if (!phoneUtil.isValidNumber(parsedNumber)) {
      throw new Error("Invalid phone number");
    }

    // Format the number in international format
    return phoneUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
