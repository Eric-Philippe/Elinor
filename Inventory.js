const axios = require("axios");

const DatabaseAddr = require("./env").DATABASE;
/**
 * @typedef {Object} Item
 * @property {String} id
 * @property {String} name
 * @property {Number} quantity
 */
module.exports = class Inventory {
  /**
   * Return all the items in the inventory
   * @returns {Item[]}
   */
  static async getAllItems() {
    let result = await axios.get(`${DatabaseAddr}/inventory/`);
    return result.data;
  }
  /**
   * Return all the items in the inventory and remove the duplicates
   * @returns {Item[]}
   */
  static async getAllItemsUnique() {
    let items = await Inventory.getAllItems();
    let uniqueItems = [];
    for (let i = 0; i < items.length; i++) {
      if (!uniqueItems.includes(items[i])) {
        uniqueItems.push(items[i]);
      }
    }
    return uniqueItems;
  }
  /**
   * Return if the item is in the inventory
   * @param {String} itemId
   * @returns {Boolean}
   */
  static async hasItem(itemId) {
    let items = await Inventory.getAllItemsUnique();
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        return true;
      }
    }
    return false;
  }
  /**
   * Return a single item from the inventory
   * @param {String} itemId
   * @returns {Item}
   */
  static async getItem(itemId) {
    if (await Inventory.hasItem(itemId)) {
      let items = await Inventory.getAllItems();
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
          return items[i];
        }
      }
    }
    throw new Error("Unable to find the item in the inventory.");
  }
  /**
   * Return the quantity of an item in the inventory
   * @param {String} itemId
   * @returns {Number}
   */
  static async getItemQuantity(itemId) {
    if (await Inventory.hasItem(itemId)) {
      let item = await Inventory.getItem(itemId);
      return item.quantity;
    }
    throw new Error("Unable to find the item in the inventory.");
  }
  /**
   * Add an item to the inventory
   * @param {String} itemId
   * @param {String} _name
   * @returns {Number}
   */
  static async addItem(itemId, _name) {
    try {
      if (await Inventory.hasItem(itemId)) {
        let item = await this.getItem(itemId);
        let qte = item.quantity + 1;
        await axios.patch(`${DatabaseAddr}/inventory/${item.id}`, {
          quantity: qte,
        });
        return 0;
      } else {
        await axios.post(`${DatabaseAddr}/inventory/`, {
          id: itemId,
          name: _name,
          quantity: 1,
        });
        return 1;
      }
    } catch (error) {
      return -1;
    }
  }
  /**
   * Remove an item from the inventory
   * @param {String} itemId
   * @returns {Number}
   */
  static async removeItem(itemId) {
    try {
      if (await Inventory.hasItem(itemId)) {
        let item = await this.getItem(itemId);
        let qte = item.quantity - 1;
        if (qte === 0) {
          await axios.delete(`${DatabaseAddr}/inventory/${item.id}`);
          return 0;
        } else {
          await axios.patch(`${DatabaseAddr}/inventory/${item.id}`, {
            quantity: qte,
          });
          return 0;
        }
      } else {
        return 1;
      }
    } catch (error) {
      return -1;
    }
  }
};
