const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const {QuickDB} = require('quick.db');
const db = new QuickDB();

module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription("Warns a user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('user')
            .setDescription("Give a user to warn")
            .setRequired(true)    
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription(`Give a reason to warn the user`)
            .setRequired(false)    
        ),
    async execute(client, interaction) {

        let user = interaction.options.getMember('user');
        let reason = interaction.options.getString('reason');

        let muterole = await interaction.guild.roles.cache.find(r => r.id == '1077580827921240175')
        let staffrole = await interaction.guild.roles.cache.find(r => r.name.toLowerCase() == "Staff")

        if(user.roles.cache.has(staffrole)) return interaction.reply('You cannot warn staff.')

        if(!reason) reason = 'No reason given.';
    
        let warns = await db.get(`userinfo_${user.id}.warns`)

        if(!warns) await db.set(`userinfo_${user.id}.warns`, 1)
        else if(warns) await db.add(`userinfo_${user.id}.warns`, 1)

        interaction.reply(`Succesfully warned ${user.user.tag} for: ${reason}`)

        if(warns == 3) {
            setTimeout(async () => {
                await user.user.roles.cache.add(muterole);
            }, 21600000)
        }

        if(warns == 6) {
            await user.kick({reason: "Too many warns."})
            var embed = new EmbedBuilder()
            .setTitle("Member kicked.")
            .setDescription(`${user.user.tag} (${user.id}) was kicked for ${reason}`)
            .setColor(0xff0000)
            .setTimestamp();

        var ticketChannel = interaction.member.guild.channels.cache.find(channel => channel.name === "mod-logs");
        if (!ticketChannel) interaction.reply({ content: "Log channel doesn't exist", ephemeral: true });

        ticketChannel.send({ embeds: [embed] })
        }

        if(warns == 12) {
            user.ban({time: 1, reason: "Too many warns."})
        }

        if(warns == 24) {
            user.ban({reason: "Too many warns."})
        }
        
    }
};