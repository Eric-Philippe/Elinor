const EMOTE = require("../assets/emotes.json");
const {
  ChatInputCommandInteraction,
  ButtonBuilder,
  InteractionResponse,
  ActionRowBuilder,
  ButtonStyle,
  ButtonInteraction,
  EmbedBuilder,
} = require("discord.js");
const { fs } = require("file-system");
const Rewards = require("../reward.json");

module.exports = class Shop {
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  constructor(interaction) {
    /** @type {ChatInputCommandInteraction} */
    this.interaction = interaction;
    /** @type {InteractionResponse} */
    this.interactionResponse = null;
    /** @type {Number} */
    this.page = 0;
    this.__init__();
  }

  async __init__() {
    await this.displayWelcome();
    await this.launchController();
  }

  async displayWelcome() {
    this.interactionResponse = await this.interaction.editReply({
      files: [fs.readFileSync("./assets/Shop.png")],
      components: await this.buildController(),
    });
  }

  async displayReward() {}

  async buildController(state = false) {
    switch (this.page) {
      case 0:
        return this.buildController0(state);
    }
  }

  async launchController() {
    const filter = (i) => i.user.id === this.interaction.user.id;
    const collector = this.interactionResponse.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.customId.startsWith("shop:")) {
        let action = i.customId.split(":")[1];

        if (action === "leave") {
          await i.update({
            content: "Shop fermé.",
            components: [],
          });
          collector.stop();
          return;
        }

        let answer = await this.buidConfirmation(
          i,
          "Voulez-vous acheter le " + action + " ?"
        );

        if (answer) {
          // Send the gif located in assets/Loading.gif
          let embed = new EmbedBuilder()
            .setTitle("Chargement...")
            .setDescription("Veuillez patienter...")
            .setColor("Orange")
            .setImage("https://i.imgur.com/6ijXHH2.gif")
            .setTimestamp();

          await i.editReply({
            content: " ",
            embeds: [embed],
            components: [],
          });

          setTimeout(async () => {
            i.editReply({
              content: "NOTHING LOL",
              embeds: [],
              components: [],
            });
          }, 4500);
        } else {
          this.disableButtons(i, false);
          i.deleteReply();
        }
      }
    });
  }

  async buildController0(state) {
    return [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("shop:leave")
          .setLabel("Quitter")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🚪")
          .setDisabled(state),
        new ButtonBuilder()
          .setCustomId("shop:tier1")
          .setLabel("Tier 1")
          .setStyle(ButtonStyle.Primary)
          .setEmoji(EMOTE.TIER_ONE)
          .setDisabled(state),
        new ButtonBuilder()
          .setCustomId("shop:tier2")
          .setLabel("Tier 2")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(state)
          .setEmoji(EMOTE.TIER_TWO),
        new ButtonBuilder()
          .setCustomId("shop:tier3")
          .setLabel("Tier 3")
          .setStyle(ButtonStyle.Primary)
          .setEmoji(EMOTE.TIER_THREE)
          .setDisabled(state)
      ),
    ];
  }
  /**
   * Confirmation (Yes/No) Box that returns the user's choice
   * @param {ButtonInteraction} interaction
   * @param {String} content
   * @returns {Promise<boolean>}
   */
  async buidConfirmation(interaction, content) {
    return new Promise(async (resolve) => {
      this.disableButtons(interaction, true);

      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("shop:yes")
          .setLabel("Oui")
          .setStyle(ButtonStyle.Success)
          .setEmoji("✅"),
        new ButtonBuilder()
          .setCustomId("shop:no")
          .setLabel("Non")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌")
      );

      let embed = new EmbedBuilder()
        .setTitle("🛒 | Confirmation")
        .setDescription("✅ | " + content)
        .setColor("Orange");

      await interaction.reply({
        embeds: [embed],
        components: [row],
      });

      const filter = (i) =>
        i.customId === "shop:yes" ||
        i.customId === "shop:no" ||
        i.user.id === this.interaction.user.id;
      const collector =
        this.interaction.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });

      collector.on("collect", async (i) => {
        i.deferUpdate();
        if (i.customId === "shop:yes") {
          resolve(true);
        } else if (i.customId === "shop:no") {
          resolve(false);
        }
        collector.stop();
      });
    });
  }
  /**
   * Disable all buttons
   * @param {ButtonInteraction} interaction
   * @param {boolean} disabled
   */
  async disableButtons(interaction, disabled = false) {
    let row = await this.buildController(disabled);
    await interaction.message.edit({
      components: row,
    });
  }
};
