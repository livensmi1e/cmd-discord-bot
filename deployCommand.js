const { REST, Routes } = require("discord.js");
require("dotenv").config();
const commands = require("./commands/slash");

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;

const commandsData = Object.values(commands).map((cmd) => cmd.data.toJSON());

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(
            `Started refreshing ${commandsData.length} application (/) commands.`
        );
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            {
                body: commandsData,
            }
        );
        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (err) {
        console.error(err);
    }
})();
