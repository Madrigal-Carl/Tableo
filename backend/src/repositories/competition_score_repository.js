const { CompetitionScore } = require("../database/models");

module.exports = {
  /**
   * Find a score by unique combination of category, candidate, judge, and criterion
   */
  async findByUnique({ categoryId, candidateId, judgeId, criterionId, transaction }) {
    return CompetitionScore.findOne({
      where: {
        category_id: categoryId,
        candidate_id: candidateId,
        judge_id: judgeId,
        criterion_id: criterionId,
      },
      transaction,
      paranoid: false, // include soft-deleted if exists
    });
  },

  /**
   * Create a new competition score
   */
  async create(data, transaction) {
    return CompetitionScore.create(data, { transaction });
  },

  /**
   * Bulk create scores
   */
  async bulkCreate(dataArray, transaction) {
    return CompetitionScore.bulkCreate(dataArray, { transaction });
  },

  /**
   * Find all scores for a specific category
   */
  async findByCategory(categoryId) {
    return CompetitionScore.findAll({
      where: { category_id: categoryId },
      order: [["created_at", "ASC"]],
    });
  },

  /**
   * Find all scores for a candidate (optionally filtered by categoryIds)
   */
  async findByCandidate(candidateId, categoryIds = []) {
    const where = { candidate_id: candidateId };
    if (categoryIds.length > 0) where.category_id = categoryIds;

    return CompetitionScore.findAll({
      where,
      order: [["category_id", "ASC"], ["created_at", "ASC"]],
    });
  },
};
