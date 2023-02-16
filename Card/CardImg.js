const canvas = require("canvas");

const Card = require("./Card");

const CARD_BACK_ADDR = "./assets/CardBack.png";
const CARD_FRONT_ADDR = "./assets/CardFront.png";
const STAMP_ADDR = "./assets/Stamp.png";

const CARD_BACK = {
  addr: CARD_BACK_ADDR,
  width: 1748,
  height: 1240,
};

const STAMP = {
  addr: STAMP_ADDR,
  width: 200,
  height: 200,
};
/**
 * Static class that provides the card image
 */
module.exports = class CardImg {
  static async generateCardBack() {
    let cardData = Card();
    let stampsTotal = cardData.getStampCount();
    // If we have 13, we will show 1, if we have 26, we will show 2, etc...
    let stampsNeeded;
    if (stampsTotal % 12 === 0) stampsNeeded = 12;
    else stampsNeeded = stampsTotal % 12;
    // Draw the amount of stamps needed on the card
    let canva = canvas.createCanvas(CARD_BACK.width, CARD_BACK.height);
    let ctx = canva.getContext("2d");
    let cardBack = await canvas.loadImage(CARD_BACK.addr);
    ctx.drawImage(cardBack, 0, 0, CARD_BACK.width, CARD_BACK.height);

    const MARGIN = 260;
    const STAMP_LENGTH = STAMP.width + 65;
    const ECART_WIDTH = 120;
    const HEIGHT = 120;
    const ECART_HEIGHT = 70;

    for (let i = 0; i < stampsNeeded; i++) {
      let stamp = await canvas.loadImage(STAMP.addr);
      ctx.drawImage(
        stamp,
        MARGIN + (i % 4) * (stamp.width + ECART_WIDTH),
        HEIGHT + Math.floor(i / 4) * (stamp.height + ECART_HEIGHT),
        STAMP_LENGTH,
        STAMP_LENGTH
      );
      // Write the date just below the stamp
      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(
        cardData.getStamps()[i],
        MARGIN + 16 + (i % 4) * (stamp.width + ECART_WIDTH),
        HEIGHT + 7 + Math.floor(i / 4) * (stamp.height + ECART_HEIGHT) + 250
      );

      // Write the credit
      let credit = cardData.getCredit();
      // Another font as Arial is not supported, a prettier font would be nice
      ctx.font = "100px Abyssinica SIL";
      ctx.fillStyle = "black";
      ctx.fillText(credit, 685, 1050);
    }
    return canva.toBuffer();
  }

  static async generateCardFront() {
    let cardData = Card();
    let canva = canvas.createCanvas(CARD_BACK.width, CARD_BACK.height);
    let ctx = canva.getContext("2d");
    let cardFront = await canvas.loadImage(CARD_FRONT_ADDR);
    ctx.drawImage(cardFront, 0, 0, CARD_BACK.width, CARD_BACK.height);
    return canva.toBuffer();
  }
};
