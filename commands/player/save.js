const { EmbedBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'save',
    description:('Save the current track!'),
    voiceChannel: true,

    async execute(inter) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

       

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(`:arrow_forward: ${queue.currentTrack.title}`)
            .setURL('https://parspng.com/wp-content/uploads/2022/09/quranpng.parspng.com-12.png')
            .addFields(
                { name: await Translate('Duration <:hourglass:>'), value: `\`${queue.currentTrack.duration}\``, inline: true },
                { name: await Translate('Audio by:'), value: `\`${queue.currentTrack.author}\``, inline: true },
                //{ name: await Translate('Views <:eyes:>'), value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true },
                { name: await Translate('Audio <URL>:'), value: `\`${queue.currentTrack.url}\`` }
            )
            //.setThumbnail(queue.currentTrack.thumbnail)
            //.setFooter({ text: await Translate(`From the server <${inter.member.guild.name}>`), iconURL: inter.member.guild.iconURL({ dynamic: false }) });

        inter.member.send({ embeds: [embed] })
        .then(async () => {
            return inter.editReply({ content: await Translate(`I have sent you the music in private messages <✅>`) });
        }).catch(async () => {
            return inter.editReply({ content: await Translate(`Unable to send you a private message... try again ? <❌>`) });
        });
    }
}