const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "resume",
    description: "Чтобы возобновить прерванную музыку",
    usage: "",
    aliases: [],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
        .setDescription("▶ Возобновил музыку для вас!")
        .setColor("YELLOW")
        .setAuthor("Музыка возобновилась!")
      return message.channel.send(xd);
    }
    return sendError("На этом сервере ничего не играет.", message.channel);
  },
};
