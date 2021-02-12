const { MessageEmbed } = require('discord.js')

module.exports = {
    info: {
        name: "help",
        description: "Чтобы показать все команды",
        usage: "[команда]",
        aliases: ["commands", "help me", "pls help", "h"]
    },

    run: async function (client, message, args) {
        var allcmds = "";

        client.commands.forEach(cmd => {
            let cmdinfo = cmd.info
            allcmds += "``" + client.config.prefix + cmdinfo.name + " " + cmdinfo.usage + "`` ~ " + cmdinfo.description + "\n"
        })

        let embed = new MessageEmbed()
            .setAuthor("Команды " + client.user.username)
            .setColor("BLUE")
            .setDescription(allcmds)
            .setFooter(`Чтобы получить информацию о каждой команде, ${client.config.prefix}help [команда]`)

        if (!args[0]) return message.channel.send(embed)
        else {
            let cmd = args[0]
            let command = client.commands.get(cmd)
            if (!command) command = client.commands.find(x => x.info.aliases.includes(cmd))
            if (!command) return message.channel.send("Неизвестная Команда")
            let commandinfo = new MessageEmbed()
                .setTitle("Команда: " + command.info.name + " информация")
                .setColor("YELLOW")
                .setDescription(`
Название: ${command.info.name}
Описание: ${command.info.description}
Использование: \`\`${client.config.prefix}${command.info.name} ${command.info.usage}\`\`
Псевдонимы: ${command.info.aliases.join(", ")}
`)
            message.channel.send(commandinfo)
        }
    }
}
