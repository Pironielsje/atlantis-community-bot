const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription("Close the ticket.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(client, interaction) {

        const catId = "1077306290533040240";

        if (interaction.channel.parentId == catId) {
            interaction.reply(`Channel will be deleted in 10 seconds.`)
            setTimeout(() => {
                interaction.channel.delete();
            }, 10000)
        } else {
            await interaction.reply("This is only possible in a ticket channel.");
            return;
        }

        var embed = new EmbedBuilder()
            .setTitle("Ticket " + interaction.channel.name + " closed.")
            .setDescription("The ticket was closed by a staff member.")
            .setColor(0x32CD32)
            .setTimestamp();

        var ticketChannel = interaction.member.guild.channels.cache.find(channel => channel.name === "mod-logs");
        if (!ticketChannel) interaction.reply({ content: "Log channel doesn't exist", ephemeral: true });

        ticketChannel.send({ embeds: [embed] })
    }
};