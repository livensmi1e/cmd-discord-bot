const Commander = require("./store/model/cmder.js");

(async () => {
    const cmd = new Commander("python", "print(1)");
    await cmd.execute();
    const output = cmd.result();
    console.log(output);
})();
