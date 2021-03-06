const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "stop",
    description: "Чтобы остановить музыку и очистить очередь",
    usage: "",
    aliases: [],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel) return sendError("Мне очень жаль, но вы должны быть в голосовом канале, чтобы играть музыку!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Нет ничего такого, что я мог бы остановить для тебя.", message.channel);
    if (!serverQueue.connection) return
    if (!serverQueue.connection.dispatcher) return
    try {
      serverQueue.connection.dispatcher.end();
    } catch (error) {
      message.guild.me.voice.channel.leave();
      message.client.queue.delete(message.guild.id);
      return sendError(`:notes: Игрок остановился, и очередь была очищена.: ${error}`, message.channel);
    }
    message.client.queue.delete(message.guild.id);
    serverQueue.songs = [];
    message.react("✅")
  },
};