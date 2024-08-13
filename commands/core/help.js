const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'help',
    description:("All the commands this bot has!"),
    showHelp: false,

    async execute(inter) {

        //console.log(inter)
        //const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate('/play-chapter - player a recitation of a chapter in a voice channel\n/list-surahs - get a list of the chapters and their ids in Arabic or English\n/get-verse - fetch a verse from the Quran given the chapter and verse number'))

        
        inter.editReply({ embeds: [embed] });
    }
};