const axios = require("axios");

const DatabaseAddr = require("../env").DATABASE;

const Reward = require("./Reward");

module.exports = class RewardUtils {
  /**
   * Returns all the rewards from the database
   * @returns {Reward[]}
   */
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
      rewards.push(new Reward(reward));
    }
    return rewards;
  }
  /**
   * Return all the reward that are not unique or has a claimed = 0
   * @returns {Reward[]} - The available rewards
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
   * @Main_Actor
   * - Build the weight of the all the rewards
   * - Get a random number between 0 and the weight total
   * - Get the reward that has the weight that is the closest to the random number
   * @param {Reward[]} rewards
   * @param {Number} tier
   * @returns {Reward}
   */
  static getRandomReward(rewards, tier) {
    const weightedRewards = RewardUtils.getWeightedRewards(rewards, tier);

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
   * Return all the reward as a base 100 percentage
   * @param {Reward[]} rewards
   * @param {Number} tier
   * @returns {{reward: Reward, weight: Number}[]} - The weighted rewards
   */
  static getWeightedRewards(rewards, tier) {
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

    return weightedRewards;
  }
  /**
   * Display all the percentage of chance for each reward
   * @param {{reward: Reward, weight: Number}[]} weightedRewards
   * @param {Number} tier
   */
  static displayRewardsPercentage(weightedRewards, tier) {
    console.log(`Percentage of chance for each reward for tier ${tier}:`);
    for (const weightedReward of weightedRewards) {
      console.log(`${weightedReward.reward.name}: ${weightedReward.weight}%`);
    }
  }
  /**
   * Get a reward with the id
   * @param {String} rewardId
   * @returns {Reward | -1}
   */
  static async getReward(rewardId) {
    const rewards = await RewardUtils.loadRewardsFromJson();
    const reward = rewards.find((reward) => reward.id === rewardId);
    if (!reward) return -1;
    return reward;
  }
  /**
   * Claim a reward
   * @param {String} rewardId
   */
  static async claimReward(rewardId) {
    const reward = await RewardUtils.getReward(rewardId);
    if (reward === -1) throw new Error("Invalid reward id.");
    if (reward.unique && reward.claimed === 1)
      throw new Error("The reward has already been claimed.");
    // reward.claimed = 1;
    // Change the claimed value to 1 on the database
    try {
      await axios.patch(DatabaseAddr + "/rewards/" + rewardId, {
        claimed: 1,
      });
    } catch (error) {
      throw new Error("Unable to claim the reward.");
    }
  }
};
