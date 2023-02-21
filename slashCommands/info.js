const { EmbedBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription("Gives you some information about the server."),
    async execute(client, interaction) {

        let date = new Date(interaction.member.joinedTimestamp);

        const embed = new EmbedBuilder()
            .setTitle("Information")
            .setColor(0x00ffff)
            .setFields(
                { name: "Owner", value: `<@${interaction.guild.ownerId}>`},
                { name: "Total Members", value: `${interaction.guild.memberCount} members`},
                { name: "Joined Server At", value: date.toLocaleString()}
            )

        await interaction.reply({embeds: [embed]});

    }};