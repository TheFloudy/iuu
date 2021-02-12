const { MessageEmbed } = require('discord.js')
const moment = require("moment")

module.exports = {
    info: {
        name: "serverinfo",
        description: "Чтобы показать все команды",
        usage: "",
        aliases: ["server", "sv"]
    },

    run: async function (client, message, args) {

        let embed = new MessageEmbed()

        .setColor("BLUE") 
        .setThumbnail(message.guild.iconURL())
        .setDescription(`Информация о сервере **${message.guild}**`)
        .addField("ID", `${message.guild.id}`)
        .addField("Владелец", `<@${message.guild.ownerID}>`, true)
        .addField("Участников", `${message.guild.memberCount}`, true)
        .addField("Каналов", `${message.guild.channels.cache.size}`, true)
        .addField("Регион", `${message.guild.region}`, true)
        .addField("Эмодзи", `${message.guild.emojis.cache.size}`, true)
        .addField("Ролей", `${message.guild.roles.cache.size}`, true)
        .addField("Создан", `${moment.utc(message.member.user.createdAt).format('DD.MM.YYYY')}`)
     
        message.channel.send(embed)

    }
}
