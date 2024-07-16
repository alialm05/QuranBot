const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    disableMentions: 'everyone',
});

require("dotenv").config();

client.config = require('./config');
const quranInfo = require('./other/Surahs.js');
client.chapters = quranInfo.surahs
client.reciters = quranInfo.reciters
//console.log(client.chapters)

const player = new Player(client, client.config.opt.discordPlayer);
player.extractors.loadDefault();

console.clear()
require('./loader');

client.login(process.env.token)
.catch(async (e) => {
    console.log(e)
    /*if(e.message === 'An invalid token was provided.'){
    
    else{
        console.error('❌ An error occurred while trying to login to the bot! ❌ \n', e)
    }*/
});