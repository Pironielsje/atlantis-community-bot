const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const {QuickDB} = require('quick.db');
const db = new QuickDB();

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription("Unwarns a user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('user')
            .setDescription("Give a user to unwarn")
            .setRequired(true)    
        ),
    async execute(client, interaction) {

        let user = interaction.options.getMember('user');

        let staffrole = await interaction.guild.roles.cache.find(r => r.name.toLowerCase() == "Staff")

        if(user.roles.cache.has(staffrole)) return interaction.reply('Staff can\'t have any warns.')
    
        let warns = await db.get(`userinfo_${user.id}.warns`)

        if(!warns || warns == 0) return interaction.reply(`This user does not have any warns currently.`)
        else if(warns) await db.sub(`userinfo_${user.id}.warns`, 1)

        await interaction.reply(`Succesfully subtracted 1 warn from ${user.user.tag}.`)
    }
};