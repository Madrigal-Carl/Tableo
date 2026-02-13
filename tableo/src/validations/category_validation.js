export function validateCategories(categoryList) {
    const errors = [];

    categoryList.forEach((c, idx) => {
        const rowErrors = {};

        // ✅ NAME — Required
        if (c.name === undefined || c.name === null || c.name.trim() === "") {
            rowErrors.name = "Category name is required";
        } else if (!/[a-zA-Z]/.test(c.name)) {
            rowErrors.name = "Category name must include at least one letter";
        }

        // ✅ WEIGHT — Required
        if (c.weight === undefined || c.weight === null || c.weight === "") {
            rowErrors.weight = "Weight is required";
        } else {
            const weightNum = Number(c.weight);

            if (isNaN(weightNum)) {
                rowErrors.weight = "Weight must be a number";
            } else if (!Number.isInteger(weightNum)) {
                rowErrors.weight = "Weight must be a whole number";
            } else if (weightNum <= 0) {
                rowErrors.weight = "Weight must be greater than 0";
            }
        }

        // ✅ MAX SCORE — Required
        if (c.maxScore === undefined || c.maxScore === null || c.maxScore === "") {
            rowErrors.maxScore = "Max score is required";
        } else {
            const maxScoreNum = Number(c.maxScore);

            if (isNaN(maxScoreNum)) {
                rowErrors.maxScore = "Max score must be a number";
            } else if (!Number.isInteger(maxScoreNum)) {
                rowErrors.maxScore = "Max score must be a whole number";
            } else if (maxScoreNum <= 0) {
                rowErrors.maxScore = "Max score must be greater than 0";
            }
        }

        if (Object.keys(rowErrors).length > 0) {
            errors[idx] = rowErrors;
        }
    });

    return errors;
}
