import { showToast } from "../utils/swal";

export const validateInvitationCode = (code) => {
  if (!code?.trim()) {
    showToast("error", "Invitation code is required");
    return false;
  }

  const trimmedCode = code.trim().toUpperCase();
  const pattern = /^JDG-[A-Z0-9]{6}$/;

  if (!pattern.test(trimmedCode)) {
    showToast("error", "Invalid invitation code format (e.g., JDG-XXXXX)");
    return false;
  }

  return true;
};

export const validateJudgeData = ({ name, suffix }) => {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    showToast("error", "Judge name is required");
    return false;
  }

  if (trimmedName.toLowerCase() === "judge") {
    showToast("error", "Please enter a valid judge name");
    return false;
  }

  if (!suffix?.trim()) {
    showToast("error", "Suffix is required");
    return false;
  }

  return true;
};
