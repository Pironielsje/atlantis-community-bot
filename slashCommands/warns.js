const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const {QuickDB} = require('quick.db');
const db = new QuickDB();

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription("Shows the warns of the given user. If no user is given it will display the executor's warns.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('user')
            .setDescription("Give a user to warn")
            .setRequired(true)    
        ),
    async execute(client, interaction) {

        let user = interaction.options.getMember('user');

        if(!user) user = interaction.user;
    
        let warns = await db.get(`userinfo_${user.id}.warns`)

        if(!warns) return interaction.reply(`This person has no warns.`)
        else if(warns) return interaction.reply(`This person has ${warns} warn(s).`)
        
    }
};