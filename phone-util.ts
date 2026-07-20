import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";

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
  { name: "Eswatini", dialCode: "+268", code: "SZ", flag: "🇸🇿" },
];

const phoneUtil = PhoneNumberUtil.getInstance();

export function normalizePhoneNumber(
  phone: string,
  countryCode: string,
): string {
  const parsedNumber = phoneUtil.parseAndKeepRawInput(phone, countryCode);

  if (!phoneUtil.isValidNumber(parsedNumber)) {
    throw new Error("Invalid phone number");
  }

  return phoneUtil.format(parsedNumber, PhoneNumberFormat.E164);
}
