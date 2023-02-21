const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription("Creates a ticket for you to ask the staff questions!")
        .addStringOption((option) =>
            option.setName("reason")
                .setDescription("Give a reason why you created a ticket.")
                .setRequired(true)),
    async execute(client, interaction) {

        const catId = "1077306290533040240";

        var userName = interaction.user.username;
        var userDiscrim = interaction.user.discriminator;

        const reason = await interaction.options.getString("reason");

        var ticketExists = false;

        interaction.guild.channels.cache.forEach((channel) => {

            if (channel.name === userName.toLowerCase() + "-" + userDiscrim) {
                interaction.reply({content: "❌ You already have an open ticket.", ephemeral: true})
                ticketExists = true;
                return;
            }

        });

        if (ticketExists) return;

        interaction.guild.channels.create({ name: userName.toLowerCase() + "-" + userDiscrim, type: ChannelType.GuildText, parent: catId })
            .then((createdChan) => {
                // Perms zodat iedereen niets kan lezen.
                // LET OP het is nu PascalCase i.p.v. snake_case ook NIET camelCase.
                createdChan.permissionOverwrites.edit(interaction.guild.roles.cache.find(x => x.id === "1077314665291452416"), {

                    SendMessages: false,
                    ViewChannel: false
                    // SEND_MESSAGES: false,
                    // VIEW_CHANNEL: false

                });

                // Perms zodat de gebruiker die het command heeft getypt alles kan zien van zijn ticket.
                createdChan.permissionOverwrites.edit(interaction.user.id, {
                    CreateInstantInvite: false,
                    ReadMessageHistory: true,
                    SendMessages: true,
                    AttachFiles: true,
                    Connect: true,
                    AddReactions: true,
                    ViewChannel: true
                });

                // Perms zodat de gebruikers die een bepaalde rol hebben alles kan zien van zijn ticket.
                createdChan.permissionOverwrites.edit(interaction.guild.roles.cache.find(x => x.name === "Staff"), {
                    CreateInstantInvite: false,
                    ReadMessageHistory: true,
                    SendMessages: true,
                    AttachFiles: true,
                    Connect: true,
                    AddReactions: true,
                    ViewChannel: true
                });

                var embed = new EmbedBuilder()
                    .setAuthor({ name: userName })
                    .setTitle("New Ticket")
                    .setColor(0x32CD32)
                    .addFields(
                        { name: "Reason", value: reason }
                    );

                createdChan.send({ embeds: [embed], content: "Staff will be with you shortly! Please be patient!" });

                interaction.reply({ content: `Ticket created in: <#${createdChan.id}>`, ephemeral: true })
            }
            ).catch(err => {
                interaction.reply({ content: 'Something went wrong ' + err, ephemeral: true })
            });
    }
};