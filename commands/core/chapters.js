const { ApplicationCommandOptionType, SlashCommandBuilder, EmbedBuilder, } = require("discord.js")
//const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel, getVoiceConnections, AudioPlayerStatus } = require('@discordjs/voice');
const quranApi = require('../../QuranApi')

module.exports = {
    name: 'list-surahs',
    description:("List the Chapters (Surahs) from the Quran"),
    options: [
        {
            name: 'language',
            description:('Language the Surahs will be listed in'),
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'English', value: 'en' },
                { name: 'Arabic', value: 'ar' },
            ],
        },
    ],

    /*data:new SlashCommandBuilder()
    .setName("list-surahs")
    .setDescription("List the Chapters (Surahs) from the Quran")
    .addStringOption((option) =>
    option.setName('language')
    .setDescription('Language')
    .setRequired(true)
    .addChoices(
        { name: 'English', value: 'en' },
        { name: 'Arabic', value: 'ar' },
    )
    ),*/

    async execute(interaction) {


        try {
            
            //console.log(interaction)
            const{ channel, client, options, member, guild} = interaction;
            
            //console.log(interaction);
            var lang = options.getString('language')

            console.log(lang)
      

            quranApi.getChapters(lang, function(r, success){
                //console.log(`${JSON.stringify(r)}`);
                
                //url = r;
                if (success) {

                    
                    //let chaps = JSON.parse(r)
                    let allChaps = ''; // dont leave empty if will be concantenated
                    
                    for (var i=0; i< r.length; i++) {
                        if (i % 5 == 0 ){
                            allChaps = lang == 'en' ? allChaps + `\n${r[i].name_simple}: **(${r[i].id})**; ` : allChaps + `\n${r[i].name_arabic}: **(${r[i].id})**; `
                        }
                        else{
                            allChaps = lang == 'en' ? allChaps + `\t${r[i].name_simple}: **(${r[i].id})**; ` : allChaps + `\t${r[i].name_arabic}: **(${r[i].id})**; `
                        }
                        //console.log(`\n${r[i].name_simple}: ${r[i].id}`);
                     }

                


                    //console.log("success")

                    // embed sucess
                    
                    const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`Chapter-ID List: `)
                    .setDescription(`${allChaps}`)
                    
                    interaction.editReply({ embeds: [embed]});

                }
                else{
                    console.log("failed")
                    interaction.editReply({ content: `*Error, status code: ${r.status}* \nMessage: **${r.error}**`});
                }
               
                }
                
                
            );


        } catch (e) {
            console.log(e);
        
        }
    }


}