export function validateCategories(categoryList) {
    if (!categoryList || categoryList.length === 0) {
        return "At least one category is required";
    }

    for (let i = 0; i < categoryList.length; i++) {
        const c = categoryList[i];

        // NAME
        if (c.name === undefined || c.name === null || c.name.trim() === "") {
            return `Category #${i + 1}: Name is required`;
        }

        if (!/[a-zA-Z]/.test(c.name)) {
            return `Category #${i + 1}: Name must include at least one letter`;
        }

        // WEIGHT
        if (c.weight === undefined || c.weight === null || c.weight === "") {
            return `Category #${i + 1}: Weight is required`;
        }

        const weightNum = Number(c.weight);

        if (isNaN(weightNum)) {
            return `Category #${i + 1}: Weight must be a number`;
        }

        if (!Number.isInteger(weightNum)) {
            return `Category #${i + 1}: Weight must be a whole number`;
        }

        if (weightNum <= 0) {
            return `Category #${i + 1}: Weight must be greater than 0`;
        }

        // MAX SCORE
        if (c.maxScore === undefined || c.maxScore === null || c.maxScore === "") {
            return `Category #${i + 1}: Max score is required`;
        }

        const maxScoreNum = Number(c.maxScore);

        if (isNaN(maxScoreNum)) {
            return `Category #${i + 1}: Max score must be a number`;
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
