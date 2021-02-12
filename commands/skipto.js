const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skipto",
    description: "Перейти к выбранному номеру очереди",
    usage: "[skipto <номер>]",
    aliases: ["st"],
  },

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send({
        embed: {
          color: "GREEN",
          description: `**Использование**: \`${client.config.prefix}skipto <number>\``
        }

      }).catch(console.error);


    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("Очереди нет.", message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Очередь есть только ${queue.songs.length} песни длинные!`, message.channel).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    try {
      queue.connection.dispatcher.end();
    } catch (error) {
      queue.voiceChannel.leave()
      message.client.queue.delete(message.guild.id);
      return sendError(`:notes: Игрок остановился, и очередь была очищена.: ${error}`, message.channel);
    }

    queue.textChannel.send({
      embed: {
        color: "GREEN",
        description: `${message.author} ⏭ пропуcтить \`${args[0] - 1}\` песни`
      }

    }).catch(console.error);
    message.react("✅")

  },
};
