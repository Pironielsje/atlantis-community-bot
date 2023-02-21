const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription("Unlock a channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(client, interaction) {

        interaction.channel.permissionOverwrites.create(interaction.guild.roles.cache.find(r => r.name == "@everyone").id, {
            SendMessages: true
        });

        var embed = new EmbedBuilder()
        .setTitle('Unlock')
        .setColor(0x32CD32)
        .setDescription(`This channel has been unlocked.`)
    
        await interaction.reply({embeds: [embed]})

    }
};