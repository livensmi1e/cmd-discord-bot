function encodeBase64(input) {
    return Buffer.from(input).toString("base64");
}

function decodeBase64(input) {
    return Buffer.from(input, "base64").toString();
}

function parse(content) {
    const pattern = /^(\w+)\s+(\w+)\s*\n*(?:```([\s\S]+?)```|([\s\S]+))$/;
    const match = content.match(pattern);
    let command = match[1];
    let language = match[2];
    let source = match[3] || match[4];
    return [command, language, source];
}

module.exports = {
    encodeBase64,
    decodeBase64,
    parse,
};
