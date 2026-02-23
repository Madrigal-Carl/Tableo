export function validateCandidate(data) {
  const name = data.name?.trim();

  if (!name) {
    return "Candidate name is required";
  }

  if (name.toLowerCase() === "candidate") {
    return "Please enter a valid candidate name";
  }

  // LENGTH
  if (name.length < 8) {
    return "Candidate name must be at least 8 characters";
  }

  if (name.length > 50) {
    return "Candidate name must not exceed 50 characters";
  }

  if (!data.sex || data.sex.trim() === "") {
    return "Sex is required";
  }

  if (!["male", "female"].includes(data.sex.toLowerCase())) {
    return 'Sex must be either "male" or "female"';
  }

  if (!data.photo && !data.existingPath) {
    return "Photo is required";
  }

  return null;
}
