const { EmbedBuilder, Colors } = require("discord.js");
const Commander = require("../store/model/cmder.js");
const { updateStats } = require("../store/fstore.js");

const run = async (message, lang, source) => {
    try {
        const cmder = new Commander(lang, source);
        await cmder.execute();
        const result = cmder.result();

        const color =
            result.status.description === "Accepted"
                ? Colors.Green
                : Colors.Red;
        const outputEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Remote Code Execution")
            .setTimestamp()
            .addFields({
                name: "Output",
                value: `\`\`\`${result.language.name}\n${result.output}\`\`\``,
            })
            .addFields(
                {
                    name: "Time",
                    value: `${result.time} s`,
                    inline: true,
                },
                {
                    name: "Memory",
                    value: `${Math.round(result.memory / 1024)} MB`,
                    inline: true,
                }
            )
            .setFooter({
                text: `${result.language.version} | ${result.status.description}`,
                iconURL: `${result.language.icon}`,
            });

        await updateStats(
            result.language.name,
            result.status.description === "Accepted"
        );

        await message.channel.send({ embeds: [outputEmbed] });
    } catch (err) {
        throw err;
    }
};

module.exports = run;
