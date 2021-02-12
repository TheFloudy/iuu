module.exports = async (client) => {
  console.log(`[API] Вы вошли как ${client.user.username}`);
  await client.user.setActivity("Дяу котак али", {
    type: "WATCHING",//LISTENING, WATCHING, PLAYING, STREAMING
  });
};
