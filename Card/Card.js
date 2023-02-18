const fs = require("fs");
/**
 * @typedef CardData
 * @property {Array<String>} STAMPS - Array of stamps containing the date
 * @property {HistoryData} HISTORY - History of the card
 */
/**
 * @typedef HistoryData
 * @property {Number} removed - Number of stamps removed
 * @property {Number} creditUsed - Number of credits used
 */
const TOTAL_STAMPS_BY_CARD = 12;
class _Card {
  constructor() {
    /** @type {CardData} */
    this.data = this.loadCardData();
  }
  /**
   * Returns the card data
   * @returns {CardData}
   */
  loadCardData() {
    /** @type {CardData} */
    let cardData = { STAMPS: [], HISTORY: { REMOVED: 0, CREDIT_USED: 0 } };
    let data = JSON.parse(fs.readFileSync("./card.json", "utf8"));
    if (!data) throw new Error("No card data found");
    cardData.STAMPS = data.STAMPS;
    cardData.HISTORY = data.HISTORY;
    return cardData;
  }
  /**
   * Overload the current card Data to the JSON file
   */
  saveCardData() {
    fs.writeFileSync("card.json", JSON.stringify(this.data, null, 4));
  }
  /**
   * Add a stamp to the card
   * @param {Number} stampNumber
   * @returns {Number} 0 if successful, -1 if not
   */
  addStamp(stampNumber) {
    if (!stampNumber) throw new Error("No stamp number provided");
    if (typeof stampNumber !== "number")
      throw new Error("Stamp number must be a number");

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dateString = `${day}/${month}/${year}`;

    for (let i = 0; i < stampNumber; i++) {
      this.data.STAMPS.push(`${dateString}`);
    }

    try {
      this.saveCardData();
      return 0;
    } catch (err) {
      return -1;
    }
  }
  /**
   * Remove a stamp from the card
   * @param {Number} stampNumber
   * @returns {Number} 0 if successful, -1 if not
   */
  removeStamp(stampNumber) {
    if (!stampNumber) throw new Error("No stamp number provided");
    if (typeof stampNumber !== "number")
      throw new Error("Stamp number must be a number");

    this.data.HISTORY.removed += stampNumber;
    this.data.STAMPS.splice(0, stampNumber);

    try {
      this.saveCardData();
      return 0;
    } catch (err) {
      return -1;
    }
  }
  /**
   * Get the total number of stamps on the card
   * @returns {Number}
   */
  getStampCount() {
    return this.data.STAMPS.length;
  }
  /**
   * Use credit on the card
   * @returns {Number} 0 if successful, -1 if not -404 if error
   */
  useCredit() {
    if (this.getStampCount() < TOTAL_STAMPS_BY_CARD) return -1;
    this.data.STAMPS.splice(0, TOTAL_STAMPS_BY_CARD);
    this.data.HISTORY.creditUsed += 1;

    try {
      this.saveCardData();
      return 0;
    } catch (err) {
      return -404;
    }
  }
  /**
   * Use Credits
   * @param {Number} creditNumber
   */
  useCredits(creditNumber) {
    for (let i = 0; i < creditNumber; i++) {
      this.useCredit();
    }
  }
  /**
   * Get the total credit available on the card
   * @returns {Number}
   */
  getCredit() {
    return Math.floor(this.getStampCount() / TOTAL_STAMPS_BY_CARD);
  }
  /**
   * Get the sorted stamps, the array will always have 0 to 12 stamps
   * @returns {Array<String>}
   */
  getStamps() {
    return _Card.getRecentStamps(this.data.STAMPS);
  }
  /**
   * Take an array of stamps date, and return the same ordered array (oldest to newest)
   * @param {Array<String>} stamps
   */
  static sortStamps(stamps) {
    let sortedStamps = [];
    let stampDates = [];
    for (let i = 0; i < stamps.length; i++) {
      let stamp = stamps[i];
      //let stampDate = new Date(stamp);
      // The stamp is in the format DD/MM/YYYY
      let stampDate = new Date(
        stamp.split("/")[2],
        stamp.split("/")[1] - 1,
        stamp.split("/")[0]
      );
      stampDates.push(stampDate);
    }
    stampDates.sort((a, b) => a - b);
    for (let i = 0; i < stampDates.length; i++) {
      let stampDate = stampDates[i];
      let stamp = stampDate.toDateString();
      sortedStamps.push(stamp);
    }
    return sortedStamps;
  }
  /**
   * Take the last 10 stamps from an array of stamps, and return them
   * @param {Array<String>} stamps
   */
  static getRecentStamps(stamps) {
    let recentStamps = [];
    let sortedStamps = this.sortStamps(stamps);
    if (sortedStamps.length < TOTAL_STAMPS_BY_CARD) return sortedStamps;
    // Copy the last 10 stamps
    for (
      let i = sortedStamps.length - TOTAL_STAMPS_BY_CARD;
      i < sortedStamps.length;
      i++
    ) {
      recentStamps.push(sortedStamps[i]);
    }
    return recentStamps;
  }
}
/**
 * Singleton pattern
 * @returns {_Card}
 */
module.exports = Card = () => {
  if (Card.instance) return Card.instance;
  Card.instance = new _Card();
  return Card.instance;
};
