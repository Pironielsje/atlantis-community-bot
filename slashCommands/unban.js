const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription("Unban a user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName("id")
                .setDescription("Give a user id to unban.")
                .setRequired(true)
        ),
    async execute(client, interaction) {

        let id = interaction.options.getString("id");

        let member;

        let bans = await interaction.guild.bans.fetch();

        if (bans.has(id)) member = bans.get(id);
        else return interaction.reply("User is not banned.")

        await interaction.guild.members.unban(id);

        interaction.reply(`${member.user.tag} has been unbanned.`);

    }
};