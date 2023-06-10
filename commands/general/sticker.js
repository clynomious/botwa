const { writeExifImg, writeExifVid } = require('../../utils/exif');

module.exports = {
    name: 'sticker',
    alias: ['stiker', 'stikergif', 'stikerg', 'stikerv', 'stikergif', 'stikerg', 's',],
    category: 'general',
    desc: 'Create sticker from image or video',
    use: 'packagename|authorname',
    async exec({ msg, arg, client }) {
        const { quoted, from, type } = msg;
        const packname = arg.split("|")[0] || "Cly Bot";
		const author = arg.split("|")[1] || "Ig: @jar.cly";

        const content = JSON.stringify(quoted);
		const isMedia = type === "imageMessage" || type === "videoMessage";
		const isQImg = type === "extendedTextMessage" && content.includes("imageMessage");
		const isQVid = type === "extendedTextMessage" && content.includes("videoMessage");
		const isQDoc = type === "extendedTextMessage" && content.includes("documentMessage");

		await client.sendMessage(msg.from,
            {
              react: {
                text: "⏳",
                key: msg.key,
              },
            },
          );

        let buffer, stickerBuff;
        try {
          const packnameStr = packname.toString();
          const authorStr = author.toString();
        
          if ((isMedia && !msg.message.videoMessage) || isQImg) {
            buffer = await (isQImg ? quoted.download() : msg.download());
            stickerBuff = await writeExifImg(buffer, { packname: packnameStr, author: authorStr });
          } else if ((isMedia && msg.message.videoMessage.fileLength < 2 << 20) || (isQVid && quoted.message.videoMessage.fileLength < 2 << 20)) {
            buffer = await (isQVid ? quoted.download() : msg.download());
            stickerBuff = await writeExifVid(buffer, { packname: packnameStr, author: authorStr });
          } else if (isQDoc && (/image/.test(quoted.message.documentMessage.mimetype) || (/video/.test(quoted.message.documentMessage.mimetype) && quoted.message.documentMessage.fileLength < 2 << 20))) {
            buffer = await quoted.download();
            const stickerBuffVid = await writeExifVid(buffer, { packname: packnameStr, author: authorStr });
            const stickerBuffImg = await writeExifImg(buffer, { packname: packnameStr, author: authorStr });
            stickerBuff = stickerBuffVid || stickerBuffImg;
          }
        
          if (buffer && stickerBuff) {
            await client.sendMessage(from, { sticker: { url: `${stickerBuff}` } }, { quoted: msg });
            await client.sendMessage(msg.from, { react: { text: "✅", key: msg.key } });
          } else {
            await msg.reply(`Silahkan kirim/reply gambar/video/dokumen yang ingin di convert ke sticker.\nPastikan ukuran tidak melebihi 2MB dan durasi tidak lebih 10detik.`);
            await client.sendMessage(msg.from, { react: { text: "❌", key: msg.key } });
          }
        } catch (e) {
          await msg.reply("Error while creating sticker");
          await client.sendMessage(msg.from, { react: { text: "❌", key: msg.key } });
        }   
            
    }
}