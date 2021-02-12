const { MessageEmbed } = require("discord.js");

module.exports = {
  info: {
    name: "invite",
    description: "Добавить / пригласить бота на ваш сервер",
    usage: "[пригласить]",
    aliases: ["inv"],
  },

  run: async function (client, message, args) {
    
    //set the permissions id here (https://discordapi.com/permissions.html)
    var permissions = 8;
    
    let invite = new MessageEmbed()
    .setTitle(`Пригласить ${client.user.username}`)
    .setDescription(`Хочешь, я войду в твой сервер? Пригласи меня сейчас! \n\n [Ссылка На Приглашение](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot)`)
    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`)
    .setColor("BLUE")
    return message.channel.send(invite);
  },
};
