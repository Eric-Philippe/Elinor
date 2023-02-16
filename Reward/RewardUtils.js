const Reward = require("./Reward");

module.exports = class RewardUtils {
  static loadRewardsFromJson() {
    let Rewards = require("../reward.json").REWARDS;
    const rewards = [];
    for (const reward of Rewards) {
      rewards.push(new Reward(reward));
    }
    return rewards;
  }
  /**
   * Returns the rewards of a specific tier
   * @param {Reward[]} rewards
   * @param {Number} tier
   */
  static getRewardsByTier(rewards, tier) {
    const rewardsByTier = [];
    for (const reward of rewards) {
      if (reward.tier === tier) rewardsByTier.push(reward);
    }
    return rewardsByTier;
  }
  /**
   * Returns the rewards for only claimable rewards
   * @param {Reward[]} rewards
   * @param {Boolean} claimable
   * @returns {Reward[]}
   */
  static getRewardsByClaimable(rewards, claimable = false) {
    const rewardsByClaimable = [];
    for (const reward of rewards) {
      if (reward.directly_claimable === claimable)
        rewardsByClaimable.push(reward);
    }
    return rewardsByClaimable;
  }
  /**
   * Returns the rewards for only unique rewards
   * @param {Reward[]} rewards
   * @param {Boolean} unique
   * @returns {Reward[]}
   */
  static getRewardsByUnique(rewards, unique = false) {
    const rewardsByUnique = [];
    for (const reward of rewards) {
      if (reward.unique === unique) rewardsByUnique.push(reward);
    }
    return rewardsByUnique;
  }
};
