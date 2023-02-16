const { Client, GatewayIntentBits, Collection } = require("discord.js");
const path = require("path");
const fs = require("fs");
const Card = require("./Card/Card");
const CardImg = require("./Card/CardImg");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/** =========== @Discord_Bot_Commands_Setup =========== */
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  // Commmand Interaction Type
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Une erreur s'est produite durant la commande !",
      ephemeral: true,
    });
  }
});

client.login(require("./token.json").TOKEN);
