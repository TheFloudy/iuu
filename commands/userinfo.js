const { MessageEmbed } = require('discord.js')
const moment = require("moment")

module.exports = {
    info: {
        name: "userinfo",
        description: "Чтобы показать все команды",
        usage: "",
        aliases: ["user"]
    },


    run: async function (client, message, args) {

        let user;

        if (!args[0]) {
            user = message.member;
        } else {

            user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(err => { return message.channel.send(":x: Не удалось найти этого человека") })
        }

        if (!user) {
            return message.channel.send(":x: Не могу найти этого человека!")
        }

        let stat = {
            online: "https://emoji.gg/assets/emoji/9166_online.png",
            idle: "https://emoji.gg/assets/emoji/3929_idle.png",
            dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
            offline: "https://emoji.gg/assets/emoji/7445_status_offline.png"
        }

        let badges = await user.user.flags
        badges = await badges ? badges.toArray() : ["Нету"]

        let newbadges = [];
        badges.forEach(m => {
            newbadges.push(m.replace("_", " "))
        })

        let embed = new MessageEmbed()
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))

        let array = []
        if (user.user.presence.activities.length) {

            let data = user.user.presence.activities;

            for (let i = 0; i < data.length; i++) {
                let name = data[i].name || "Нету"
                let xname = data[i].details || "Нету"
                let zname = data[i].state || "Нету"
                let type = data[i].type

                array.push(`**${type}** : \`${name} : ${xname} : ${zname}\``)

                if (data[i].name === "Spotify") {
                    embed.setThumbnail(`https://i.scdn.co/image/${data[i].assets.largeImage.replace("spotify:", "")}`)
                }

                embed.setDescription(array.join("\n"))

            }
        }

        embed.setColor(user.displayHexColor === "BLUE" ? "BLUE" : user.displayHexColor)

        embed.setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))

        if (user.nickname !== null) embed.addField("ID", user.user.id)
        embed.setColor("BLUE")
            .addField("Имя", `${user.nickname}`, true)
            .addField("Дискриминатор", `${user.user.discriminator}`, true)
            .addField("Бот", `${user.user.bot}`, true)
            .addField("На сервере с", moment.utc(message.member.joinedAt).format('DD.MM.YYYY'), true)
            .addField("В дискорде с", moment.utc(message.member.user.createdAt).format('DD.MM.YYYY'), true)



        return message.channel.send(embed).catch(err => {
            return message.channel.send("Error : " + err)
        });
    }
}

