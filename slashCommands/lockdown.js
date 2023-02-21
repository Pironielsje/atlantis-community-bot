const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription("Lock a channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(client, interaction) {

        interaction.channel.permissionOverwrites.create(interaction.guild.roles.cache.find(r => r.name == "@everyone").id, {
            SendMessages: false
        });

        interaction.channel.permissionOverwrites.create(interaction.guild.roles.cache.find(r => r.name == "Staff").id, {
            SendMessages: true
        });

        var embed = new EmbedBuilder()
        .setTitle('Lockdown')
        .setColor(0xff0000)
        .setDescription(`This channel has been locked down.`)
    
        await interaction.reply({embeds: [embed]})

    }
};