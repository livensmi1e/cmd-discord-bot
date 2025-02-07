const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const commands = require("./commands");

const TOKEN = process.env.TOKEN;
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.on(Events.InteractionCreate, async (interaction) => {
    try {
        let cmd = interaction.commandName;
        if (cmd in commands) {
            await commands[cmd].execute(interaction);
        }
    } catch (err) {
        await interaction.reply(`Something wrong happened`);
        console.error(e);
    }
});

client.once(Events.ClientReady, async (client) => {
    try {
        console.log(`User ${client.user.username} logged in`);
    } catch (err) {
        console.error(e);
    }
});

client.login(TOKEN);
