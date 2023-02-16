const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

const Shop = require("../Shop/Shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Ouvre le Shop"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    new Shop(interaction);
  },
};
