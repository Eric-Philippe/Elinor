const fs = require("fs");
/**
 * @typedef Reward
 * @property {String} name - Name of the reward
 * @property {String} description - Description of the reward
 * @property {Array<Number>} tier - Tier of the reward maxs [100, 200, 300],
 * @property {String} id - ID of the ressource
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
    /** @type {String} */
    this.id = reward.id;
    /** @type {String} */
    this.ressource_type = reward.ressource_type;
    /** @type {Boolean} */
    this.unique = reward.unique;
    /** @type {Boolean} */
    this.directly_claimable = reward.directly_claimable;
    /** @type {Number} */
    let tier = reward.tier;
    this.claimed = reward.claimed;
    if (tier[0] < 0 || tier[0] > 100)
      throw new Error(
        `Invalid first tier for the reward with the name: ${this.name}`
      );
    if (tier[1] < -100 || tier[1] > 200)
      throw new Error(
        `Invalid second tier for the reward with the name: ${this.name}`
      );
    if (tier[2] < -200 || tier[2] > 400)
      throw new Error(
        `Invalid third tier for the reward with the name: ${this.name}`
      );
    /** @type {Array<Number>} */
    this.tier = reward.tier;
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
    let exist = fs.existsSync(`./assets/rewards/${this.id}.png`);
    if (!exist) throw new Error(`Reward image doesn't exist: ${this.id}`);
    return `./assets/rewards/${this.id}.png`;
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
