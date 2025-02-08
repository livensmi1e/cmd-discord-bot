require("dotenv").config();
const { request } = require("undici");
const { encodeBase64, decodeBase64 } = require("../../utils.js");

const languageMap = {
    python: {
        id: 71,
        name: "python",
        version: "Python (3.8.1)",
        icon: "https://i.imgur.com/N4RyEvG.png",
    },
    cplusplus: {
        id: 54,
        name: "cplusplus",
        version: "C++ (GCC 9.2.0)",
        icon: "https://i.imgur.com/CJYqkG5.png",
    },
    golang: {
        id: 60,
        name: "golang",
        version: "Go (1.13.5)",
        icon: "https://i.imgur.com/a3yrHtU.png",
    },
    java: {
        id: 62,
        name: "java",
        version: "Java (OpenJDK 13.0.1)",
        icon: "https://i.imgur.com/5OwBztX.png",
    },
    javascript: {
        id: 63,
        name: "javascript",
        version: "JavaScript (Node.js 12.14.0)",
        icon: "https://i.imgur.com/YOsQqBF.png",
    },
    php: {
        id: 68,
        name: "php",
        version: "PHP (7.4.1)",
        icon: "https://i.imgur.com/cnnYSIE.png",
    },
    go: {
        id: 95,
        name: "go",
        version: "Go (1.18.5)",
        icon: "https://i.imgur.com/a3yrHtU.png",
    },
    bash: {
        id: 46,
        name: "bash",
        version: "Bash (4.4)",
        icon: "https://i.imgur.com/6BQ4g4J.png",
    },
};

class Commander {
    constructor(language, sourceCode, stdin = null) {
        this.languageID = languageMap[language].id;
        this.language = languageMap[language];
        this.sourceCode = sourceCode;
        this.input = stdin;

        this.status = null;
        this.output = null;
        this.time = null;
        this.memory = null;
        this.error = null;

        this.judgeURI = process.env.JUDGE_URI || "http://localhost:2358";
        this.baseURI = `${this.judgeURI}/submissions`;
        this.token = "";
    }

    async execute() {
        const reqBody = {
            source_code: encodeBase64(this.sourceCode),
            language_id: this.languageID,
            stdin: this.input ? encodeBase64(this.input) : null,
        };
        const { body } = await request(`${this.baseURI}/?base64_encoded=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        const { token } = await body.json();
        if (token !== "") {
            this.token = token;
        } else {
            console.log("[+] Token not returned");
        }
        await this._pollForResult();
    }

    result() {
        return {
            languageID: this.languageID,
            language: this.language,
            sourceCode: this.sourceCode,
            input: this.input,
            output: this.output,
            time: this.time,
            memory: this.memory,
            error: this.error,
            status: this.status,
        };
    }

    async _pollForResult() {
        let result;
        while (true) {
            result = await this._getResult();
            if (result.stdout !== null || result.stderr !== null) {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
        this._processOutput(result);
    }

    async _getResult() {
        const { body } = await request(
            `${this.baseURI}/${this.token}?base64_encoded=true&fields=stdout,stderr,time,memory,status`
        );
        return await body.json();
    }

    _processOutput(body) {
        this.output = body.stdout ? decodeBase64(body.stdout) : null;
        this.error = body.stderr ? decodeBase64(body.stderr) : null;
        this.time = body.time;
        this.memory = body.memory;
        this.status = body.status;
    }
}

module.exports = Commander;
