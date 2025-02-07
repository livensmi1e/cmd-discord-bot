const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("run")
        .setDescription("Remote execute code")
        .addStringOption((option) =>
            option
                .setName("language")
                .setDescription("Language to execute")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("code")
                .setDescription("Source code to execute")
                .setRequired(true)
        ),
    async execute(interaction) {
        const lang = interaction.options.getString("language");
        const code = interaction.options.getString("code");
        await interaction.reply(`${lang} - \`\`\`${code}\`\`\``);
    },
};
