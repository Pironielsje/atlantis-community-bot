const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription("Unmutes a user.")
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Specify a user to mute')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(client, interaction) {

        let user = interaction.options.getMember('user');

        let muterole = await interaction.guild.roles.cache.find(r => r.id == '1077580827921240175')

        if(!user.roles.cache.has(muterole)) return interaction.reply(`This user isn't muted.`)

        user.roles.remove(muterole)
        interaction.reply(`Succesfully unmuted ${user.user.tag}!`)
         
    }
};