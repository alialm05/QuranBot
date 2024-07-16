const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Emoji, ComponentType } = require("discord.js")
//const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel, getVoiceConnections, AudioPlayerStatus } = require('@discordjs/voice');
const quranApi = require('../../QuranApi')

function setAyah(r){

    return new Promise(resolve => {
        setTimeout(function () { // function is sync, so the caller is waiting for the value to be return
            
            const verse = r.verse;

            var entireAyah = '*\"';
            for (var word = 0; word < verse.words.length-1; word++){

                

                var phrase = verse.words[word].translation.text
                entireAyah = word+1 == verse.words.length-1 ? entireAyah + phrase : entireAyah + phrase + ' '
                //(phrase.includes('(') && phrase.includes(')') && (Number(phrase.substring(1, phrase.length-1))))
                //if (word+1 == verse.words.length){entireAyah = entireAyah + '\"'}
            }

            entireAyah = entireAyah + `"* **${verse.words[verse.words.length-1].translation.text}** ` 

            resolve(entireAyah);
            //console.log("Returned first promise");
        }, 500);
    });

    //return Promise.resolve(entireAyah);
}

module.exports = {


    name: 'get-verse',
    description:("Display the Verse searched"),
    options: [
        {
            name: 'chapter',
            description:('Surah Number'),
            type: ApplicationCommandOptionType.Number ,
            required: true,
        },
        {
            name: 'verse',
            description:('Ayah Number'),
            type: ApplicationCommandOptionType.Number ,
            required: true,
        },
    ],

    /*data:new SlashCommandBuilder()
    .setName("get-verse")
    .setDescription("Display the Verse searched")
    .addNumberOption((option) =>
    option.setName('chapter')
    .setDescription('Surah Number')
    .setRequired(true)
    )
    .addNumberOption((option) =>
    option.setName('verse')
    .setDescription('Ayah Number')
    .setRequired(true),
    ),*/

    async execute(interaction) {

        //await interaction.deferReply();

        try {
            
            const{ channel, client, options, member, guild} = interaction;
            
            var c = interaction.options.getNumber('chapter')
            var v = interaction.options.getNumber('verse')
            
            if (c < 1 || c > 114){
                interaction.editReply({ content: `invalid surah`});
                return;
            }
            
            var cvs = c.toString() + ':' + v.toString();


            quranApi.getVerse(cvs, async function(r, sucess){
                //console.log(`${JSON.stringify(r)}`);
                
                //url = r;
                if (sucess) {

                    

                    var Ayah = await setAyah(r); // waits till returned value
                    //console.log(Ayah);

                    const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`${cvs}`)
                    .setDescription(`${Ayah}`)

                    //buttons

                    buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('back')
                        .setEmoji('⬅️')
                        .setStyle(3)
                        .setDisabled(false),
                        new ButtonBuilder()
                        .setCustomId('next')
                        .setEmoji('➡️')
                        .setStyle(3)
                        .setDisabled(false),
                    )

                    interaction.editReply({ embeds: [embed], components: [buttons]});

                    const collector = interaction.channel.createMessageComponentCollector(
                        { 
                        componentType: ComponentType.Button,
                        filter: (i) => i.user.id == interaction.user.id,
                        time: 60_000,    
                        }
                    )

                    collector.on('collect', async i => {

                        
                        if (i.customId == 'next'){
                            v+=1;
                            let cvs = c.toString() + ':' + v.toString();
                            //console.log(cvs);
                            quranApi.getVerse(cvs, async function(r, sucess){
                                if (sucess){
                                    
                                    Ayah = await setAyah(r); // waits till returned value

                                    const embed = new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle(`${cvs}`)
                                    .setDescription(`${Ayah}`)

                                    await i.update({ embeds: [embed], components: [buttons] });
                                }
                                else{
                                    //console.log(`*Error, status code: ${r.status}* \nMessage: **${r.error}**`)
                                    //interaction.editReply({ content: `*Error, status code: ${r.status}* \nMessage: **${r.error}**`});
                                    buttons = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId('back')
                                        .setEmoji('⬅️')
                                        .setStyle(3)
                                        .setDisabled(true),
                                        new ButtonBuilder()
                                        .setCustomId('next')
                                        .setEmoji('➡️')
                                        .setStyle(3)
                                        .setDisabled(true),
                                    )
                                    interaction.editReply({ components: [buttons]});

                                }
                            })
                        }
                        else if (i.customId == 'back'){
                            v-=1;
                            let cvs = c.toString() + ':' + v.toString();

                            quranApi.getVerse(cvs, async function(r, sucess){
                                if (sucess){
                                    
                                    Ayah = await setAyah(r); // waits till returned value

                                    const embed = new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle(`${cvs}`)
                                    .setDescription(`${Ayah}`)

                                    await i.update({ embeds: [embed], components: [buttons] });
                                }
                                else{
                                    const embed = new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle(`${cvs}`)
                                    .setDescription(`${Ayah}`)

                                    buttons = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId('back')
                                        .setEmoji('⬅️')
                                        .setStyle(3)
                                        .setDisabled(true),
                                        new ButtonBuilder()
                                        .setCustomId('next')
                                        .setEmoji('➡️')
                                        .setStyle(3)
                                        .setDisabled(true),
                                    )

                                    //console.log(`*Error, status code: ${r.status}* \nMessage: **${r.error}**`)
                                    interaction.editReply({ components: [buttons]});

                                }
                            })
                        }
                        
                    })
                    //const entireAyah = setAyah(r);

                    //console.log("success")

                    // embed sucess
                    

                    

                }
                else{
                    console.log("failed")
                    interaction.editReply({ content: `*Error, status code: ${r.status}* \nMessage: **${r.error}**`});
                }
               

                }
                
                
            );
      

        } catch (e) {
            
            await interaction.editReply({ content: `Interaction Failed with Status Code **${e.response.status}**`, ephemeral: true});
        }

    }


}