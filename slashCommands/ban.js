const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Ban a user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Give a user to ban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Give a reason to ban the user.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("time")
                .setDescription("Give a time to ban the person for.")
                .setRequired(false)
        ),
    async execute(client, interaction) {

        let role = await interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "Staff");

        let member = interaction.options.getMember("user");

        if (member.roles.cache.has(role)) {
            return interaction.reply("You cannot ban someone who is staff.");
        }

        let reason = await interaction.options.getString("reason");

        let time = await interaction.options.getInteger("time")

        if (!time) {
            time = 0;
        }

        const embed = new EmbedBuilder()
            .setTitle("Banned from Atlantis • Community")
            .setDescription(`You have been banned from Atlantis • Community for: ${reason}\nYou can appeal at: Example.com`)
            .setTimestamp()

        await member.send({ embeds: [embed] }).catch(() => {
            interaction.channel.send("This user does not allow dms.")
        });

        await member.ban({ days: time, reason: reason });

        interaction.reply(`${member.user.tag} has been banned.`);

    }
};