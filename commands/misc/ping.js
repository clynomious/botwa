const { calculatePing } = require("../../utils");

module.exports = {
    name: "ping",
    category: "misc",
    desc: "Bot response.",
    async exec({ msg }) {
        await msg.reply(`*${calculatePing(msg.messageTimestamp, Date.now())} _second(s)_*`);
    }
}