class RiskScoreService {
  async calculateRiskScore(userId, member) {
    let score = 0;
    const details = {};

    const accountAge = Date.now() - member.user.createdTimestamp;
    const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
    
    if (daysSinceCreation < 7) {
      score += 36;
      details.accountAge = { score: 90, reason: 'Account less than 7 days old' };
    } else if (daysSinceCreation < 30) {
      score += 20;
      details.accountAge = { score: 50, reason: 'Account less than 30 days old' };
    } else {
      score += 2;
      details.accountAge = { score: 5, reason: 'Account older than 30 days' };
    }

    if (!member.user.avatar) {
      score += 8;
      details.avatar = { score: 40, reason: 'No custom avatar' };
    }

    return {
      score: Math.min(Math.round(score), 100),
      level: score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW',
      details
    };
  }
}

module.exports = new RiskScoreService();