require("dotenv").config();
const { request } = require("undici");
const { encodeBase64, decodeBase64 } = require("../../utils.js");

const languageMap = {
    python: 71, // Python (3.8.1)
    cplusplus: 76, // C++ (Clang 7.0.1)
    golang: 60, // Go (1.13.5)
    java: 62, // Java (OpenJDK 13.0.1)
    javascript: 63, // JavaScript (Node.js 12.14.0)
    php: 68, // PHP (7.4.1)
    go: 60, // Go (1.13.5)
    bash: 46, // Bash (5.0.0)
};

class Commander {
    constructor(language, sourceCode, stdin = null) {
        this.languageID = languageMap[language];
        this.language = language;
        this.sourceCode = sourceCode;
        this.input = stdin;

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
            `${this.baseURI}/${this.token}?base64_encoded=true&fields=stdout,stderr,time,memory`
        );
        return await body.json();
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
        };
    }

    _processOutput(body) {
        this.output = body.stdout ? decodeBase64(body.stdout) : null;
        this.error = body.stderr ? decodeBase64(body.error) : null;
        this.time = body.time;
        this.memory = body.memory;
    }
}

module.exports = Commander;
