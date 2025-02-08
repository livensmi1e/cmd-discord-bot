const redis = require("redis");

const fstore = redis.createClient({ url: "redis://localhost:6379" });

fstore.on("error", (err) => {
    console.error(err);
});

(async () => {
    try {
        await fstore.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis Connection Failed:", error);
    }
})();

async function updateStats(language, isSuccess) {
    try {
        const stats = await fstore.get("stat");
        let data = stats ? JSON.parse(stats) : {};
        if (!data[language]) {
            data[language] = { total: 0, success: 0 };
        }
        data[language].total += 1;
        if (isSuccess) {
            data[language].success += 1;
        }
        await fstore.set("stat", JSON.stringify(data));
    } catch (error) {
        console.error("Error updating stats:", error);
    }
}

/**
 * Retrieves the current statistics
 */
async function getStats() {
    try {
        const stats = await fstore.get("stat");
        return stats ? JSON.parse(stats) : {};
    } catch (error) {
        console.error("Error retrieving stats:", error);
        return {};
    }
}

module.exports = { updateStats, getStats };
