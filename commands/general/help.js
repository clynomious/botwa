const clt = require("../../lib/Collection")
const { botName } = require("../../config.json")

module.exports = {
    name: "help",
    aliases: ["h", "menu"],
    category: "general",
    async exec({ client, msg, args, isOwner}) {
        if (args[0]) {
            const data = [];
            const name = args[0].toLowerCase();
            const { commands, prefix } = clt;
            const cmd = commands.get(name) || commands.find((cmda) => Array.isArray(cmda.alias) && cmda.alias.includes(name));
            if (!cmd || (cmd.category === "owner" && !isOwner)) return await msg.reply("No command found for " + name);
            else data.push(`*Cmd:* ${cmd.name}`);
            if (cmd.alias) data.push(`*Alias:* ${cmd.alias.join(", ")}`);
            if (cmd.desc) data.push(`*Desc:* ${cmd.desc}`);
            if (cmd.use) data.push(`*Usage:* \`\`\`${prefix}${cmd.name} ${cmd.use}\`\`\`\n\nNote: [] = optional, | = or, <> = must filled`);
            return await msg.reply(data.join("\n"));
        } else {
            const { pushName, sender } = msg;
            const { prefix, commands } = clt;
            const cmds = commands.keys();
            let category = [];
        
            for (let cmd of cmds) {
                let info = commands.get(cmd);
                if (!cmd) continue;
                if (!info.category || info.category === "owner" || info.owner) continue;
                if (Object.keys(category).includes(info.category)) category[info.category].push(info);
                else {
                    category[info.category] = [];
                    category[info.category].push(info);
                }
            }
            let data = `Hello, ${pushName === undefined ? sender.split("@")[0] : pushName} i am ${botName}\n*This is My Command List*\n\n`;
            const keys = Object.keys(category);
            for (const key of keys) {
                data += `*${key.toUpperCase()}*\n${category[key]
                    .map(
                        (cmd, idx) =>
                        `${idx + 1}. ${prefix}${cmd.name}`
                    )
                    .join("\n")}\n\n`;
            }
            data += `send ${prefix}help with command name for command details.\nex. ${prefix}help sticker`;
            await client.sendMessage(msg.from, { text: data });
        }
    },
};