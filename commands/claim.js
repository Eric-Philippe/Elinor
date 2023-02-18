const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

const Inventory = require("../Inventory");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("claim")
    .setDescription("Claim un item que tu as gagné")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("L'item que tu veux claim")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    let items = await Inventory.getAllItemsUnique();
    let itemNames = [];
    for (let i = 0; i < items.length; i++) {
      let qte = await Inventory.getItemQuantity(items[i].id);
      // If there is more than 1 item, add the quantity
      if (qte > 1) {
        itemNames.push({
          name: `(X${qte}) ${items[i].name}`,
          value: items[i].id,
        });
      } else {
        itemNames.push({
          name: items[i].name,
          value: items[i].id,
        });
      }
    }
    if (itemNames.length === 0) {
      itemNames.push({
        name: "Aucun item",
        value: "EMPTY",
      });
    }
    await interaction.respond(itemNames);
  },
  /** @param {ChatInputCommandInteraction} interaction */
  async execute(interaction) {
    await interaction.deferReply();
    let item = interaction.options.getString("item");
    if (item === "EMPTY") {
      let embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("❌ | Tu n'as aucun item à claim");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    Inventory.removeItem(item);
    let embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("✅ | Tu as claim l'item " + item);
    await interaction.editReply({
      embeds: [embed],
      content: `<@387291278670430208>`,
    });
  },
};
