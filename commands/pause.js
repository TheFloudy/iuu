const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "pause",
    description: "Чтобы приостановить текущую музыку на сервере",
    usage: "[пауза]",
    aliases: ["pause"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      try {
        serverQueue.connection.dispatcher.pause()
      } catch (error) {
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: Игрок остановился, и очередь была очищена.: ${error}`, message.channel);
      }
      let xd = new MessageEmbed()
        .setDescription("⏸ Приостановил музыку для тебя!")
        .setColor("YELLOW")
        .setTitle("Музыка была остановлена!")
      return message.channel.send(xd);
    }
    return sendError("На этом сервере ничего не играет.", message.channel);
  },
};
