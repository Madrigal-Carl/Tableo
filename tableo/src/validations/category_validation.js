export function validateCategories(categoryList) {
    if (!categoryList || categoryList.length === 0) {
        return "At least one category is required";
    }

    for (let i = 0; i < categoryList.length; i++) {
        const c = categoryList[i];

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

        if (!Number.isInteger(maxScoreNum)) {
            return `Category #${i + 1}: Max score must be a whole number`;
        }

        if (maxScoreNum <= 0) {
            return `Category #${i + 1}: Max score must be greater than 0`;
        }
    }

    return null;
}
