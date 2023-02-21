const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription("Clear a specific amount of messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('msgamount')
                .setDescription("Specify the amount of messages to clear")
                .setRequired(true)
        ),
    async execute(client, interaction) {

        var amount = await interaction.options.getInteger("msgamount")

        if (amount <= 0) {
            return interaction.reply(`Cannot delete less than one message.`)
        }
        else if (amount >= 1000) {
            return interaction.reply(`Cannot delete more than 1000 messages.`)
        }
        else if (amount < 1000 && amount > 0) {
            interaction.channel.bulkDelete(amount)
            interaction.channel.send(`${amount} messages have been deleted!`)
                .then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000)
                })
            interaction.reply({ content: 'Done! ✅', ephemeral: true })
        }

        var embed = new EmbedBuilder()
            .setTitle(`Bulk deleted messages in <#${interaction.channel.id}>`)
            .setDescription(`Bulk deleted ${amount} message(s) from ${interaction.channel.name}`)
            .setColor(0x32CD32)
            .setTimestamp();

        var ticketChannel = interaction.member.guild.channels.cache.find(channel => channel.name === "mod-logs");
        if (!ticketChannel) interaction.reply({ content: "Log channel doesn't exist", ephemeral: true });

        ticketChannel.send({ embeds: [embed] })

    }
};