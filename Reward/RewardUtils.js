const axios = require("axios");

const DatabaseAddr = require("../env").DATABASE;

const Reward = require("./Reward");

module.exports = class RewardUtils {
  static async loadRewardsFromJson() {
    let Rewards = [];
    try {
      const response = await axios.get(DatabaseAddr + "/rewards");
      Rewards = response.data;
    } catch (error) {
      throw new Error("Unable to load the rewards from the database.");
    }

    const rewards = [];
    for (const reward of Rewards) {
      if (reward.tier[0] < 0 || reward.tier[1] > 100)
        throw new Error(
          `Invalid first tier for the reward with the name: ${reward.name}`
        );
      if (reward.tier[1] < 0 || reward.tier[1] > 200)
        throw new Error(
          `Invalid second tier for the reward with the name: ${reward.name}`
        );
      if (reward.tier[2] < 0 || reward.tier[2] > 300)
        throw new Error(
          `Invalid third tier for the reward with the name: ${reward.name}`
        );
      rewards.push(new Reward(reward));
    }
    return rewards;
  }
  /**
   * Return all the reward that are not unique or has a claimed = 0
   */
  static async getAvailableRewards() {
    const rewards = await RewardUtils.loadRewardsFromJson();
    const rewardFiltered = rewards.filter(
      (reward) => !reward.unique || reward.claimed === 0
    );
    if (rewardFiltered.length === 0) throw new Error("No reward available.");
    return rewardFiltered;
  }
  /**
   * Return a random number between 0 inclusive and max exclusive
   * @param {Number} max
   * @returns {Number}
   */
  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  /**
   * - Build the weight of the all the rewards
   * - Get a random number between 0 and the weight total
   * - Get the reward that has the weight that is the closest to the random number
   * @param {Reward[]} rewards
   * @param {Number} tier
   * @returns {Reward}
   */
  static getRandomReward(rewards, tier) {
    if (rewards.length === 0) return null;
    let weightedRewards = [];
    let weightTotal = 0;
    let currentWeight = 0;
    let currentWeightedReward = { reward: null, weight: currentWeight };
    for (const reward of rewards) {
      currentWeight = reward.getTier(tier);
      currentWeightedReward = { reward: reward, weight: currentWeight };
      weightedRewards.push(currentWeightedReward);
      weightTotal += currentWeight;
    }

    if (weightTotal === 0) throw new Error("No reward available.");

    // Put it on base 100 to avoid float
    for (const weightedReward of weightedRewards) {
      weightedReward.weight = Math.floor(
        (weightedReward.weight / weightTotal) * 100
      );
    }

    if (require("../env").DEV)
      RewardUtils.displayRewardsPercentage(weightedRewards, tier);

    let random = RewardUtils.getRandomInt(100);
    let currentWeightedRewardIndex = 0;
    let currentWeightedRewardWeight = 0;
    for (const weightedReward of weightedRewards) {
      currentWeightedRewardWeight += weightedReward.weight;
      if (random < currentWeightedRewardWeight) {
        return weightedRewards[currentWeightedRewardIndex].reward;
      }
      currentWeightedRewardIndex++;
    }
  }

  /**
   * Display all the percentage of chance for each reward
   * @param {weightedReward[]} weightedRewards
   * @param {Number} tier
   */
  static displayRewardsPercentage(weightedRewards, tier) {
    console.log(`Percentage of chance for each reward for tier ${tier}:`);
    for (const weightedReward of weightedRewards) {
      console.log(`${weightedReward.reward.name}: ${weightedReward.weight}%`);
    }
  }
};
