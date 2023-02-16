const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const CardImg = require("../Card/CardImg");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription("Retire un nombre de point sur la carte."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("flip")
        .setLabel("Flip")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🔄")
    );

    let msg = await interaction.reply({
      content: "**Voici votre carte!**",
      files: [await CardImg.generateCardFront()],
      components: [row],
    });

    const filter = (i) => i.customId === "flip";
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    let flipped = false;

    collector.on("collect", async (i) => {
      let file = null;
      if (i.customId === "flip") {
        if (!flipped) file = await CardImg.generateCardBack();
        else file = await CardImg.generateCardFront();

        try {
          await i.update({
            files: [file],
            components: [row],
          });
          flipped = !flipped;
        } catch (err) {}
      }
    });
  },
};
