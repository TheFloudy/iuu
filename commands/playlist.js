const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
var ytpl = require("ytpl");
const sendError = require("../util/error");
const fs = require("fs");

module.exports = {
	info: {
		name: "playlist",
		description: "Для воспроизведения песен :D",
		usage: "[URL-адрес YouTube | название плейлиста]",
		aliases: ["pl"],
	},

	run: async function (client, message, args) {
		const channel = message.member.voice.channel;
		if (!channel) return sendError("Мне очень жаль, но для воспроизведения музыки вам нужно быть на голосовом канале!", message.channel);
		const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
		var searchString = args.join(" ");
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT")) return sendError("Я не могу подключиться к вашему голосовому каналу, убедитесь, что у меня есть соответствующие разрешения!", message.channel);
		if (!permissions.has("SPEAK")) return sendError("Я не могу подключиться к вашему голосовому каналу, убедитесь, что у меня есть соответствующие разрешения!", message.channel);

		if (!searchString || !url) return sendError(`Использование: ${message.client.config.prefix}playlist <YouTube Playlist URL | Playlist Name>`, message.channel);
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			try {
				const playlist = await ytpl(url.split("list=")[1]);
				if (!playlist) return sendError("Плейлист не найден", message.channel);
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				return message.channel.send({
					embed: {
						color: "GREEN",
						description: `✅  **|**  Плейлист: **\`${videos[0].title}\`** был добавлен в очередь`,
					},
				});
			} catch (error) {
				console.error(error);
				return sendError("Плейлист не найден :(", message.channel).catch(console.error);
			}
		} else {
			try {
				var searched = await yts.search(searchString);

				if (searched.playlists.length === 0) return sendError("Похоже, я не смог найти плейлист на YouTube", message.channel);
				var songInfo = searched.playlists[0];
				let listurl = songInfo.listId;
				const playlist = await ytpl(listurl);
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				let thing = new MessageEmbed()
					.setAuthor("Плейлист был добавлен в очередь")
					.setThumbnail(songInfo.thumbnail)
					.setColor("GREEN")
					.setDescription(`✅  **|**  Плейлист: **\`${songInfo.title}\`** было добавлено \`${songInfo.videoCount}\` видео в очередь`);
				return message.channel.send(thing);
			} catch (error) {
				return sendError("An unexpected error has occurred", message.channel).catch(console.error);
			}
		}

		async function handleVideo(video, message, channel, playlist = false) {
			const serverQueue = message.client.queue.get(message.guild.id);
			const song = {
				id: video.id,
				title: Util.escapeMarkdown(video.title),
				views: video.views ? video.views : "-",
				ago: video.ago ? video.ago : "-",
				duration: video.duration,
				url: `https://www.youtube.com/watch?v=${video.id}`,
				img: video.thumbnail,
				req: message.author,
			};
			if (!serverQueue) {
				const queueConstruct = {
					textChannel: message.channel,
					voiceChannel: channel,
					connection: null,
					songs: [],
					volume: 80,
					playing: true,
					loop: false,
				};
				message.client.queue.set(message.guild.id, queueConstruct);
				queueConstruct.songs.push(song);

				try {
					var connection = await channel.join();
					queueConstruct.connection = connection;
					play(message.guild, queueConstruct.songs[0]);
				} catch (error) {
					console.error(`Я не мог подключиться к голосовому каналу: ${error}`);
					message.client.queue.delete(message.guild.id);
					return sendError(`Я не мог подключиться к голосовому каналу: ${error}`, message.channel);
				}
			} else {
				serverQueue.songs.push(song);
				if (playlist) return;
				let thing = new MessageEmbed()
					.setAuthor("Песня была добавлена в очередь")
					.setThumbnail(song.img)
					.setColor("YELLOW")
					.addField("Название", song.title, true)
					.addField("Продолжительность", song.duration, true)
					.addField("По запросу", song.req.tag, true)
					.setFooter(`Просмотры: ${song.views} | ${song.ago}`);
				return message.channel.send(thing);
			}
			return;
		}

		async function play(guild, song) {
			const serverQueue = message.client.queue.get(message.guild.id);
			if (!song) {
				sendError(
					"Покидаю голосовой канал, потому что думаю, что в очереди нет песен. Если вам нравится бот оставайтесь 24/7 в голосовом канале",
					message.channel
				);
				message.guild.me.voice.channel.leave(); //If you want your bot stay in vc 24/7 remove this line :D
				message.client.queue.delete(message.guild.id);
				return;
			}
			let stream = null;
			if (song.url.includes("youtube.com")) {
				stream = await ytdl(song.url);
				stream.on("error", function (er) {
					if (er) {
						if (serverQueue) {
							serverQueue.songs.shift();
							play(guild, serverQueue.songs[0]);
							return sendError(`An unexpected error has occurred.\nPossible type \`${er}\``, message.channel);
						}
					}
				});
			}

			serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
			const dispatcher = serverQueue.connection.play(ytdl(song.url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus" })).on("finish", () => {
				const shiffed = serverQueue.songs.shift();
				if (serverQueue.loop === true) {
					serverQueue.songs.push(shiffed);
				}
				play(guild, serverQueue.songs[0]);
			});

			dispatcher.setVolume(serverQueue.volume / 100);
			let thing = new MessageEmbed()
				.setAuthor("Начал Играть Музыку!")
				.setThumbnail(song.img)
				.setColor("BLUE")
				.addField("Название", song.title, true)
				.addField("Продолжительность", song.duration, true)
				.addField("По запросу", song.req.tag, true)
				.setFooter(`Просмотры: ${song.views} | ${song.ago}`);
			serverQueue.textChannel.send(thing);
		}
	},
};