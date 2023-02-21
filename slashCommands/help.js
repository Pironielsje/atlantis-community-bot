const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Replies with all commands."),
    async execute(client, interaction) {

        const embed = new EmbedBuilder()
            .setColor(0x0000ff)
            .setTitle("Help")
            .setDescription("Help Command Guide")
            .addFields(
                { name: "Page 1", value: "Information Commands" },
                { name: "Page 2", value: "Moderation Commands" },
                { name: "Page 3", value: "Fun Commands" }
            )
            .setTimestamp()

        const infoEmbed = new EmbedBuilder()
            .setColor(0x0000ff)
            .setTitle("Information Commands")
            .addFields(
                { name: "/help", value: "Show this help menu." },
                { name: "/ping", value: "Returns the ping of the bot." },
                { name: "/info", value: "Gives you information about the server." }
            )
            .setTimestamp()
            .setFooter({ text: "Information Commands" })

        const modEmbed = new EmbedBuilder()
            .setColor(0x0000ff)
            .setTitle("Moderation Commands")
            .setDescription("Please note that you need permissions to use most of these commands.")
            .addFields(
                { name: "/ban", value: "Bans the user given" },
                { name: "/clear", value: "Bulk deletes the amount of messages given." },
                { name: "/close", value: "Closes the ticket the command is used in." },
                { name: "/lockdown", value: "Lock down the channel the command is used in."},
                { name: "/mute", value: "Mutes the given user. (Tempmute if you put a time with it.)"},
                { name: "/ticket", value: "Opens a ticket for the reason you give."},
                { name: "/unban", value: "Unbans the user with the id given."},
                { name: "/unlock", value: "Unlocks the channel the command is used in"},
                { name: "/unmute", value: "Unmutes the user given."},
                { name: "/unwarn", value: "Removes warns from the given user."},
                { name: "/warn", value: "Warns the given user."},
                { name: "/warns", value: "Shows the amount of warns the given user has."}
            )
            .setTimestamp()
            .setFooter({ text: "Moderation Commands" })

            const funEmbed = new EmbedBuilder()
            .setColor(0x0000ff)
            .setTitle("Fun Commands")
            .addFields(
                { name: "Under Construction", value: "Fun commands are coming soon." }
            )
            .setTimestamp()
            .setFooter({ text: "Fun Commands" })

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`info`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('❗ Info'),

                new ButtonBuilder()
                .setCustomId(`moderation`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('🔨 Moderation'),

                new ButtonBuilder()
                .setCustomId(`fun`)
                .setStyle(ButtonStyle.Primary)
                .setLabel('😂 Fun'),

                new ButtonBuilder()
                .setCustomId(`home`)
                .setStyle(ButtonStyle.Primary)
                .setLabel(`🏠 Home`)
            )

            const message = await interaction.reply({embeds: [embed], components: [button]});
            const collector = await message.createMessageComponentCollector();

            collector.on('collect', async i => {

                if(i.customId === "info") {
                    if(i.user.id !== interaction.user.id) {
                        return
                    }
                    await i.update({embeds: [infoEmbed], components: [button]})
                }
                
                if(i.customId === "moderation") {
                    if(i.user.id !== interaction.user.id) {
                        return 
                    }
                    await i.update({embeds: [modEmbed], components: [button]})
                }

                if(i.customId === "fun") {
                    if(i.user.id !== interaction.user.id) {
                        return
                    }
                    await i.update({embeds: [funEmbed], components: [button]})
                }

                if(i.customId === "home") {
                    if(i.user.id !== interaction.user.id) {
                        return
                    }
                    await i.update({embeds: [embed], components: [button]})
                }


            })

    }
};