const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
//const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, } = require('@discordjs/voice');
const { createAudioResource } = require('discord-voip');
const { QueryType, useMainPlayer, StreamDispatcher, createAudioPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

const quranApi = require('../../QuranApi')

const path = require('path');
const fs = require('fs');

const surahsTxt =  path.join(__dirname,'../../other/Surahs') + '.txt'
/*const player1 = createAudioPlayer({ // old player
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
});*/


module.exports = {
    name: 'play-chapter',
    description:("Play a Surah from the Quran!"),
    voiceChannel: true,
    options: [
        {
        name: 'chapter',
        description:('Surah to be Recited'),
        type: ApplicationCommandOptionType.Number,
        required: true,
        },
        {
            name: 'reciter',
            description:('Surah to be Recited'),
            type: ApplicationCommandOptionType.Number,
            required: false,
            choices: client.reciters
            },
    ],


    async execute(interaction) {
        
        let chNum = interaction.options.getNumber('chapter')
        let RId
        interaction.options.getNumber('reciter') ? RId = interaction.options.getNumber('reciter') : RId = 1;
        //console.log(interaction.options)

        if (chNum < 1 || chNum > 114){
            await interaction.editReply({ content: `*enter a valid chapter number*`});
            return;
        }

        currCh = chNum;
        currR = RId;
        var strCh = chNum.toString()
        var strRId = RId.toString()
        var url;
        
        const clientId = client.config.app.clientId
        const permArray = interaction.channel.permissionsFor(clientId).toArray() 
        console.log(permArray)

        if((//!permArray.includes("EmbedLinks") ||*/
            !permArray.includes("Connect") 
            || !permArray.includes("Speak"))){
            console.log("no Perms")
            
            if (permArray.includes("SendMessages")){
                let defaultEmbed = new EmbedBuilder().setColor('Green');
                defaultEmbed.setAuthor({ name: 'I do not have permissions ...' });
                await interaction.editReply({ embeds: [defaultEmbed] });
            }

            return;
        } 

        const player = useMainPlayer();

        const aFile = "https://download.quranicaudio.com/qdc/abdul_baset/mujawwad/1.mp3"
        const afilPath = '../../audios/chapter1.mp3';

        let defaultEmbed = new EmbedBuilder().setColor('Green');


        try {


            
            quranApi.getAudio(strCh, strRId, async function(r, success){
                
                //console.log(r);

                if (success) {
                
                    console.log(r.audio_url);

                    await player.play(interaction.member.voice.channel, r.audio_url, 
                        {nodeOptions: {
                            metadata: interaction
                        },
                        volume: client.config.opt.volume,
                            leaveOnEmpty: client.config.opt.leaveOnEmpty,
                            leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
                            leaveOnEnd: client.config.opt.leaveOnEnd,
                            leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown
                    }); // play that resource
                    
    
                
            }
            else{
                console.log("error fetching audio")
            }
                /*defaultEmbed.setAuthor({ name: 'Audio added to queue ...' });
                await interaction.editReply({ embeds: [defaultEmbed] });*/
            })

                
        } catch (error) {
            console.log(`Play error: ${error}`);
            defaultEmbed.setAuthor({ name: await Translate(`I can't join the voice channel... try again ? <❌>`) });
            return interaction.editReply({ embeds: [defaultEmbed] });
        }
    }
}
