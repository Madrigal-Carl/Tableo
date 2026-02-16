import { showToast } from "../utils/swal";

export const validateInvitationCode = (code) => {
  if (!code?.trim()) {
    showToast("error", "Invitation code is required");
    return false;
  }

  const trimmedCode = code.trim().toUpperCase();
  const pattern = /^JDG-[A-Z0-9]{6}$/;

  if (!pattern.test(trimmedCode)) {
    showToast(
      "error",
      "Invalid invitation code format (e.g., JDG-XXXXX)"
    );
    return false;
  }

  return true;
};