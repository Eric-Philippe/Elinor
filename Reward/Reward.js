const fs = require("fs");
/**
 * @typedef Reward
 * @property {String} name - Name of the reward
 * @property {String} description - Description of the reward
 * @property {Array<Number>} tier - Tier of the reward The first weight has to be between 0 and 100, the second 0 and 200, the third 0 and 300, etc.
 * @property {String} ressource_id - ID of the ressource
 * @property {String} ressource_type - Type of the ressource
 * @property {Boolean} unique - If the reward is unique
 * @property {Boolean} directly_claimable - If the reward can be claimed directly
 * @property {Number} claimed - If the reward can be claimed
 */
module.exports = class Reward {
  /**
   * @param {Reward} reward
   */
  constructor(reward) {
    /** @type {String} */
    this.name = reward.name;
    /** @type {String} */
    this.description = reward.description;
    /** @type {Array<Number>} */
    this.tier = reward.tier;
    /** @type {String} */
    this.ressource_id = reward.ressource_id;
    /** @type {String} */
    this.ressource_type = reward.ressource_type;
    /** @type {Boolean} */
    this.unique = reward.unique;
    /** @type {Boolean} */
    this.directly_claimable = reward.directly_claimable;
    /** @type {Number} */
    this.claimed = reward.claimed;
  }
  /**
   * Returns if the reward is typed
   * @returns {Boolean}
   */
  isTyped() {
    return this.ressource_type != null;
  }
  /**
   * Returns if the reward is claimable
   * @returns {Boolean}
   */
  isClaimable() {
    return this.directly_claimable && (this.unique ? this.claimed === 0 : true);
  }
  /**
   * Returns the type of the reward
   * @returns {String}
   */
  getType() {
    return this.ressource_type;
  }
  /**
   * Returns the adress of the image of the reward
   * @returns {String}
   */
  getImgAddr() {
    if (!this.isTyped()) return null;
    let exist = fs.existsSync(`./assets/rewards/${this.ressource_id}.png`);
    if (!exist)
      throw new Error(`Reward image doesn't exist: ${this.ressource_id}`);
    return `./assets/rewards/${this.ressource_id}.png`;
  }
  /**
   * Returns the weight of the reward
   * - If the tier is equal to 1, we just return the 0th value
   * - If the tier is equal to 2, we return the addition 0th and 1st value
   * - If the tier is equal to 3, we return the addition 0th, 1st and 2nd value
   * @param {Number} tier
   * @returns {Number}
   */
  getTier(tier) {
    if (this.tier.length - 1 < tier) return 0;
    let weight = 0;
    for (let i = 0; i <= tier; i++) {
      weight += this.tier[i];
    }
    return weight;
  }
};