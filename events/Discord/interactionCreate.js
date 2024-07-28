const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');
const fs = require('fs');
const path = require('path');

let customIdList = [] // list of custom ids that are built in the music player
const butPath = path.resolve(__dirname, '../../buttons');
const buttonIds = fs.readdirSync(butPath).filter((file) =>
    file.endsWith(".js")
  );
for (const buttonId of buttonIds) {
    customIdList.push(buttonId.split('.')[0])
}

module.exports = async (client, inter) => {

    //console.log(inter.options)
    if (inter.type === InteractionType.ApplicationCommand) {
        console.log(inter.commandName);
        inter.commandName === "get-verse" ? await inter.deferReply({ ephemeral: false }) : await inter.deferReply({ ephemeral: true });

        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);
        //console.log(command.permissions)

        const errorEmbed = new EmbedBuilder().setColor('#ff0000');

        if (!command) {
            errorEmbed.setDescription(await Translate('<❌> | Error! Please contact Developers!'));
            inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            return client.slash.delete(inter.commandName);
        }

        if (command.permissions && !inter.member.permissions.has(command.permissions)) {
            errorEmbed.setDescription(await Translate(`<❌> | You need do not have the proper permissions to exacute this command`));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
            errorEmbed.setDescription(await Translate(`<❌> | This command is reserved For members with <\`${DJ.roleName}\`> `));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (command.voiceChannel) {
            if (!inter.member.voice.channel) {
                errorEmbed.setDescription(await Translate(`<❌> | You are not in a Voice Channel`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
                errorEmbed.setDescription(await Translate(`<❌> | You are not in the same Voice Channel`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        command.execute(inter, client);
    } else if (inter.type === InteractionType.MessageComponent) {
        const customId = inter.customId;
        if (!customId) return;

        if (customIdList.find(cId => cId == customId)){
            
            await inter.deferReply({ ephemeral: true });
            const queue = useQueue(inter.guild);
            
            const path = `../../buttons/${customId}.js`;
            delete require.cache[require.resolve(path)];
            const button = require(path);
            if (button) return button({ client, inter, customId, queue });
        }
        else {
            //console.log("normal button")
        }

            

    }
}