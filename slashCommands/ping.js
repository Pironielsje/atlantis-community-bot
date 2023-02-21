const { EmbedBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Replies with ping."),
    async execute(client, interaction) {

        let embed = new EmbedBuilder()
            .setTitle('Pinging...')
            .setDescription("Pinging...")
            .setColor(0xFF0000)

        let pinged = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .addFields(
                { name: "Latency", value: `${Date.now() - interaction.createdTimestamp}ms`},
                { name: "Api Latency", value: `${Math.round(client.ws.ping)}ms`}
                )
            .setColor(0x32CD32)
            .setFooter({text: `Requested by ${interaction.user.username}`, iconURL: client.user.avatarURL()})

        interaction.reply({embeds: [embed]}).then(() => {
            setTimeout(() => {
                interaction.editReply({embeds: [pinged]});
            }, 3000)
        })    
    }
};