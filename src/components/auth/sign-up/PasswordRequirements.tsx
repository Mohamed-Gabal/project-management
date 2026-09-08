import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_RULES,
} from "@/lib/validations/password-rules";
interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  // Each check reflects one condition already enforced by the Zod schema.
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasMaxLength = password.length <= PASSWORD_MAX_LENGTH;

  const hasNoWhitespace = PASSWORD_RULES.noWhitespace.test(password);

  const hasUpperLowerDigit =
    PASSWORD_RULES.uppercase.test(password) &&
    PASSWORD_RULES.lowercase.test(password) &&
    PASSWORD_RULES.digit.test(password);

  const hasSpecialChar = PASSWORD_RULES.specialChar.test(password);

  const requirements = [
    { label: "8-64 characters", met: hasMinLength && hasMaxLength },
    { label: "No spaces", met: hasNoWhitespace },
    { label: "One uppercase, lowercase, and digit", met: hasUpperLowerDigit },
    { label: "One special character", met: hasSpecialChar },
  ];

  return (
    <div className="rounded-lg bg-surface-low p-4 flex flex-col gap-2">
      {requirements.map((req) => (
        <div key={req.label} className="flex items-center gap-2">
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
              req.met
                ? "bg-success border-success"
                : "border-neutral-light bg-transparent"
            }`}
          />
          <span className="text-label-sm text-neutral">{req.label}</span>
        </div>
      ))}
    </div>
  );
};
export default PasswordRequirements;
