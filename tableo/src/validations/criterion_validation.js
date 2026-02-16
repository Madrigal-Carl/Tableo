export const validateCriteria = (criteriaList) => {
    if (!criteriaList || criteriaList.length === 0) {
        return "At least one criterion is required";
    }

    for (let i = 0; i < criteriaList.length; i++) {
        const c = criteriaList[i];

        if (!c.name?.trim()) {
            return `Criterion #${i + 1}: Label is required`;
        }

        // Must contain at least one letter
        if (!/[A-Za-z]/.test(c.name)) {
            return `Criterion #${i + 1}: Label must contain letters`;
        }

        if (c.weight === "" || c.weight === null || c.weight === undefined) {
            return `Criterion #${i + 1}: Percentage is required`;
        }

        const weight = Number(c.weight);

        if (isNaN(weight)) {
            return `Criterion #${i + 1}: Percentage must be a number`;
        }

        // ✅ Prevent decimals
        if (!Number.isInteger(weight)) {
            return `Criterion #${i + 1}: Percentage must be a whole number`;
        }

        if (weight < 0) {
            return `Criterion #${i + 1}: Percentage cannot be less than 0`;
        }

        if (weight > 100) {
            return `Criterion #${i + 1}: Percentage cannot be more than 100`;
        }
    }

    return null;
};
