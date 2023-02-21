const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const ms = require('ms')

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("Mutes a user.")
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Specify a user to mute')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription("Give a reason to mute the user")
            .setRequired(false)
        )
        .addStringOption(option => 
            option.setName("time")
            .setDescription("Specify a time to mute the person")
            .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(client, interaction) {

        let user = interaction.options.getMember('user');
        let reason = interaction.options.getString('reason');
        let time = interaction.options.getString('time')

        let muterole = await interaction.guild.roles.cache.find(r => r.id == '1077580827921240175')
        let staffrole = await interaction.guild.roles.cache.find(r => r.name.toLowerCase() == "Staff")

        if(user.roles.cache.has(muterole)) return interaction.reply(`This user is already muted. Use /unmute <@user> to unmute the user.`)
        if(user.roles.cache.has(staffrole)) return interaction.reply(`You can't mute staff.`)

        if(time) {
            user.roles.add(muterole)
            setTimeout(() => {
                user.roles.remove(muterole.id)
            }, ms(time))
            return interaction.reply(`Succesfully muted ${user.user.tag} for ${ms(ms(time))}`)
        } else if (time || time == 0) {
            user.roles.add(muterole)
            return interaction.reply(`Succesfully muted ${user.user.tag}`)
        }
         
    }
};