const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

const Card = require("../Card/Card");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-point")
    .setDescription("Ajoute un nombre de point sur la carte.")
    .addIntegerOption((option) =>
      option
        .setName("nombre-de-points")
        .setDescription("Nombre de points à ajouter sur la carte.")
        .setRequired(true)
    ),
  /** @param {ChatInputCommandInteraction} interaction */
  async execute(interaction) {
    let card = Card();
    let points = interaction.options.getInteger("nombre-de-points");
    card.addStamp(points);
    let embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setDescription("🎉 | Points ajoutés avec succès. Félicitations!");
    await interaction.reply({ embeds: [embed] });
  },
};
