const { getStats } = require("../store/fstore.js");
const { EmbedBuilder, Colors } = require("discord.js");

const stat = async (message) => {
    try {
        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTimestamp()
            .setTitle("Code execution statistics");

        const stats = await getStats();
        let [langCount, runCount] = [0, 0];
        for (const lang in stats) {
            langCount++;
            runCount += stats[lang].total;
            embed.addFields({
                name: `${lang.charAt(0).toUpperCase() + lang.substring(1)}`,
                value: `• Total: ${stats[lang].total} • Success: ${stats[lang].success}`,
            });
        }

        embed.setFooter({
            text: `Total ${langCount} language with ${runCount} times executed`,
        });
        await message.channel.send({ embeds: [embed] });
    } catch (err) {
        throw err;
    }
};

module.exports = stat;
