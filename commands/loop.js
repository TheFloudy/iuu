const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "loop",
    description: "Переключение музыкального цикла",
    usage: "[повтор]",
    aliases: ["l"],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue) {
      serverQueue.loop = !serverQueue.loop;
      return message.channel.send({
        embed: {
          color: "GREEN",
          description: `🔁  **|**  Повтор **\`${serverQueue.loop === true ? "Включен" : "Отключен"}\`**`
        }
      });
    };
    return sendError("На этом сервере ничего не играет.", message.channel);
  },
};
