const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
    info: {
        name: "disconnect",
        aliases: ["leave", "disconnect"],
        description: "Отключает бота от вашего голосового канала и очищает очередь.",
        usage: "",
    },

    run: async function (client, message, args) {
        let channel = message.member.voice.channel;
        if (!channel) return sendError("Мне очень жаль, но вам нужно быть на голосовом канале!", message.channel);
        if (!message.guild.me.voice.channel) return sendError("Я Не Нахожусь Ни В Одном Голосовом Канале!", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.kick(message.guild.me.id);
            return sendError("Попытка Покинуть Голосовой Канал...", message.channel);
        }

        const Embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Успешно")
            .setDescription("🎶 Покинул Голосовой Канал.")
            .setTimestamp();

        return message.channel.send(Embed).catch(() => message.channel.send("🎶 Покинул Голосовой Канал :C"));
    },
};