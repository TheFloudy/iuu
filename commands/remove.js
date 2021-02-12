const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "remove",
    description: "Удалить песню из очереди",
    usage: "[rm <номер>]",
    aliases: ["rm"],
  },

  run: async function (client, message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("Очереди нет.", message.channel).catch(console.error);
    if (!args.length) return sendError(`Использование: ${client.config.prefix}\`remove <Номер очереди>\``);
    if (isNaN(args[0])) return sendError(`Использование: ${client.config.prefix}\`remove <Номер очереди>\``);
    if (queue.songs.length == 1) return sendError("Очереди нет.", message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendError(`Очередь есть только ${queue.songs.length} песни длинные!`, message.channel).catch(console.error);
    try {
      const song = queue.songs.splice(args[0] - 1, 1);
      sendError(`❌ **|** Удален: **\`${song[0].title}\`** из очереди.`, queue.textChannel).catch(console.error);
      message.react("✅")
    } catch (error) {
      return sendError(`:notes: An unexpected error occurred.\nPossible type: ${error}`, message.channel);
    }
  },
};
