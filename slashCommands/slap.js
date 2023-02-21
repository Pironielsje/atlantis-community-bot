const { EmbedBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder, AttachmentBuilder} = require('discord.js');
const DIG = require("discord-image-generation")

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription("Slap!")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("Slap his ass")
            .setRequired(true)    
        ),
    async execute(client, interaction) {
        
        let user = interaction.options.getMember("user")

        if(user) user = user.user

        let avatar = user.displayAvatarURL({forceStatic: true, extension: 'png'})

        let avatar1 = interaction.user.displayAvatarURL({forceStatic: true, extension: "png"})

        let img = await new DIG.Batslap().getImage(avatar1, avatar);

        let attach = new AttachmentBuilder(img).setName("slapp.png");

        interaction.reply({files: [attach]})

    }
};