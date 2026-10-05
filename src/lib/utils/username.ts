export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;

/** Returns an error message, or null if the username is valid. */
export function validateUsername(raw: string | null | undefined): string | null {
  const username = (raw ?? "").trim();
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters!`;
  }
  if (!USERNAME_REGEX.test(username)) {
    return "Username may only contain letters, numbers, and underscores (_).";
  }
  return null;
}
