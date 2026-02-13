export const validateCriteria = (criteriaList) => {
    if (!criteriaList || criteriaList.length === 0) {
        return "At least one criterion is required";
    }

    for (let i = 0; i < criteriaList.length; i++) {
        const c = criteriaList[i];

        if (!c.name?.trim()) {
            return `Criterion #${i + 1}: Label is required`;
        }

        // Check if name has letters (at least one)
        if (!/[A-Za-z]/.test(c.name)) {
            return `Criterion #${i + 1}: Label must contain letters`;
        }

        if (c.weight === "" || c.weight === null || c.weight === undefined) {
            return `Criterion #${i + 1}: Percentage is required`;
        }

        const weight = Number(c.weight);
        if (isNaN(weight)) return `Criterion #${i + 1}: Percentage must be a number`;
        if (weight < 0) return `Criterion #${i + 1}: Percentage cannot be less than 0`;
        if (weight > 100) return `Criterion #${i + 1}: Percentage cannot be more than 100`;
    }

    // Optional: Check if total percentage equals 100
    const total = criteriaList.reduce((sum, c) => sum + Number(c.weight), 0);
    if (total !== 100) return "Total of all percentages must be exactly 100";

    return null; // No errors
};