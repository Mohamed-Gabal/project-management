export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const PASSWORD_RULES = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  digit: /[0-9]/,
  specialChar: /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]/\\;']/,
  noWhitespace: /^\S+$/,
};
