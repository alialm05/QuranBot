const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'nowplaying',
    description: 'See what song is currently playing!',
    voiceChannel: true,

    async execute(inter) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const track = queue.currentTrack;
        const methods = ['disabled', 'track', 'queue'];
        const timestamp = track.duration;
        const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;
        const progress = queue.node.createProgressBar();

        let EmojiState = client.config.app.enableEmojis;

        const emojis = client.config?.emojis;

        emojis ? EmojiState = EmojiState : EmojiState = false;

        const embed = new EmbedBuilder()
            .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setThumbnail('https://parspng.com/wp-content/uploads/2022/09/quranpng.parspng.com-12.png')
            .setDescription(await Translate(`Volume <**${queue.node.volume}**%> <\n> <Duration **${trackDuration}**> <\n> Progress <${progress}> <\n >Loop mode <**${methods[queue.repeatMode]}**> <\n>Requested by <${track.requestedBy}>`))
            //.setFooter({ text: await Translate('Music comes first - Made with heart by the Community <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })
            .setColor('Green')
            .setTimestamp();
        
        const saveButton = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : ('Save this track'))
            .setCustomId('savetrack')
            .setStyle('Success');


        const row = new ActionRowBuilder().addComponents(saveButton);
        inter.editReply({ embeds: [embed], components: [row] });
    }
}
