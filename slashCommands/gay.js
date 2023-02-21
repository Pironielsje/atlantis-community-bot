const { EmbedBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder, AttachmentBuilder} = require('discord.js');
const DIG = require("discord-image-generation")

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription("Not straight?")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("Bro's gay?")
            .setRequired(false)    
        ),
    async execute(client, interaction) {
        
        let user = interaction.options.getMember("user")

        if(user) user = user.user

        if(!user) user = interaction.user

        let avatar = user.displayAvatarURL({forceStatic: true, extension: 'png'})

        let img = await new DIG.Gay().getImage(avatar);

        let attach = new AttachmentBuilder(img).setName("gay.png");

        interaction.reply({files: [attach]})

    }
};