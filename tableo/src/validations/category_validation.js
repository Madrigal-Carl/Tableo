export function validateCategories(categoryList) {
    const errors = [];

    categoryList.forEach((c, idx) => {
        const rowErrors = {};

        // Name required
        if (!c.name || c.name.trim() === "") {
            rowErrors.name = "Category name is required";
        } else if (!/[a-zA-Z]/.test(c.name)) {
            rowErrors.name = "Category name must include at least one letter";
        }

        // Weight must be a whole number > 0
        const weightNum = Number(c.weight);
        if (c.weight === "" || isNaN(weightNum) || weightNum <= 0) {
            rowErrors.weight = "Weight must be a number greater than 0";
        } else if (!Number.isInteger(weightNum)) {
            rowErrors.weight = "Weight must be a whole number";
        }

        // MaxScore must be a whole number > 0
        const maxScoreNum = Number(c.maxScore);
        if (c.maxScore === "" || isNaN(maxScoreNum) || maxScoreNum <= 0) {
            rowErrors.maxScore = "Max score must be a number greater than 0";
        } else if (!Number.isInteger(maxScoreNum)) {
            rowErrors.maxScore = "Max score must be a whole number";
        }

        if (Object.keys(rowErrors).length > 0) {
            errors[idx] = rowErrors;
        }
    });

    return errors;
}
