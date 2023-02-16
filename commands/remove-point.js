const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

const Card = require("../Card/Card");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-point")
    .setDescription("Retire un nombre de point sur la carte.")
    .addIntegerOption((option) =>
      option
        .setName("nombre-de-points")
        .setDescription("Nombre de points à retirer sur la carte.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    let card = Card();
    let points = interaction.options.getInteger("nombre-de-points");
    card.removeStamp(points);
    let embed = new EmbedBuilder()
      .setColor("#c40000")
      .setDescription("❌ | Points retirés avec succès. Dommage!");

    await interaction.reply({ embeds: [embed] });
  },
};
