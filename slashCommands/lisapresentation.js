const { EmbedBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder, AttachmentBuilder} = require('discord.js');
const DIG = require("discord-image-generation")

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('lisapresentation')
        .setDescription("Lisa's givin a presentation")
        .addStringOption(option => 
            option.setName("text")
            .setDescription("Presentaiton text.")
            .setRequired(true)    
        ),
    async execute(client, interaction) {
        
        let user = interaction.options.getString("text")

        let img = await new DIG.LisaPresentation().getImage(user);

        let attach = new AttachmentBuilder(img).setName("presentation.png");

        interaction.reply({files: [attach]})

    }
};