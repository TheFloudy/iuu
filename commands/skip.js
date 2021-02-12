const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skip",
    description: "Чтобы пропустить текущую музыку",
    usage: "",
    aliases: ["s"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel) return sendError("Мне очень жаль, но вы должны быть в голосовом канале, чтобы играть музыку!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("Нет ничего такого, что я мог бы пропустить для тебя.", message.channel);
    if (!serverQueue.connection) return
    if (!serverQueue.connection.dispatcher) return
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
        .setDescription("▶ Возобновил музыку для вас!")
        .setColor("YELLOW")
        .setTitle("Музыка возобновилась!")

      return message.channel.send(xd).catch(err => console.log(err));

    }


    try {
      serverQueue.connection.dispatcher.end()
    } catch (error) {
      serverQueue.voiceChannel.leave()
      message.client.queue.delete(message.guild.id);
      return sendError(`:notes: Игрок остановился, и очередь была очищена.: ${error}`, message.channel);
    }
    message.react("✅")
  },
};
