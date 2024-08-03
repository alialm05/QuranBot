const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { Translate } = require("../../process_tools");

module.exports = (queue, track) => {
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;

  let EmojiState = client.config.app.enableEmojis;

  const emojis = client.config.emojis;

  emojis ? EmojiState = EmojiState : EmojiState = false;

  const inter = queue.metadata
  const ch = inter.options.getNumber("chapter");

  (async () => {
    if (inter) {

      const recitersList = client.reciters 
      let reciterName = ''

      for (let i = 0; i < recitersList.length; i++){
        if (recitersList[i].value == inter.options.getNumber('reciter')) {
          reciterName = recitersList[i].name
        }
      }      

      //<:quranicon1:1258320896616038563>

      const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Quran Bot is currently Playing: `)
      .setDescription(`
        📗 ${client.chapters[ch-1][0]} ${client.chapters[ch-1][1]}
        \n🧏‍♂️ ${reciterName ? reciterName : "Abdul Baset"}`);

    /*const back = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.back : ('Back'))
      .setCustomId('back')
      .setStyle('Primary');

    const skip = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.skip : ('Skip'))
      .setCustomId('skip')
      .setStyle('Primary');*/

    const resumepause = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.ResumePause : ('Resume & Pause'))
      .setCustomId('resume&pause')
      .setStyle(ButtonStyle.Success);

    /*const loop = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.loop : ('Loop'))
      .setCustomId('loop')
      .setStyle('Danger');

    const lyrics = new ButtonBuilder()
      .setLabel(await Translate("Lyrics"))
      .setCustomId("lyrics")
      .setStyle("Secondary");
    */

    const row1 = new ActionRowBuilder().addComponents(
      resumepause,
    );

      inter.editReply({ embeds: [embed], components: [row1], ephermal: true });
    }
    })();
};
