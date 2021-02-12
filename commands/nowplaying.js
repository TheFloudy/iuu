const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error")

module.exports = {
  info: {
    name: "nowplaying",
    description: "Чтобы показать музыку, которая в данный момент играет на этом сервере",
    usage: "",
    aliases: ["np"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("На этом сервере ничего не играет.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Теперь Играет")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Название", song.title, true)
      .addField("Продолжительность", song.duration, true)
      .addField("По запросу", song.req.tag, true)
      .setFooter(`Просмотры: ${song.views} | ${song.ago}`)
    return message.channel.send(thing)
  },
};
