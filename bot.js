const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const slashCommands = require("./commands/slash");
const commands = require("./commands");
const { parse } = require("./utils.js");

const TOKEN = process.env.TOKEN;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
});

client.on(Events.InteractionCreate, async (interaction) => {
    try {
        let cmd = interaction.commandName;
        if (cmd in slashCommands) {
            await slashCommands[cmd].execute(interaction);
        }
    } catch (err) {
        await interaction.reply(`Something went wrong`);
        console.error(err);
    }
});

client.on(Events.MessageCreate, async (message) => {
    try {
        if (message.author.bot) return;
        if (message.content.startsWith("!")) {
            let content = message.content.substring(1);
            let [cmd, lang, source] = parse(content);
            commands[cmd](message, lang, source);
        }
    } catch (err) {
        await message.reply("Something went wrong");
        console.error(err);
    }
});

client.once(Events.ClientReady, async (client) => {
    try {
        console.log(`User ${client.user.username} logged in`);
    } catch (err) {
        console.error(err);
    }
});

client.login(TOKEN);
