export function validateCategories(categoryList) {
    const errors = [];

    categoryList.forEach((c, idx) => {
        const rowErrors = {};

        if (!c.name || c.name.trim() === "") {
            rowErrors.name = "Category name is required";
        }

        if (!c.weight || isNaN(Number(c.weight)) || Number(c.weight) <= 0) {
            rowErrors.weight = "Weight must be a number greater than 0";
        }

        if (!c.maxScore || isNaN(Number(c.maxScore)) || Number(c.maxScore) <= 0) {
            rowErrors.maxScore = "Max score must be a number greater than 0";
        }

        if (Object.keys(rowErrors).length > 0) {
            errors[idx] = rowErrors;
        }
    });

    return errors;
}
