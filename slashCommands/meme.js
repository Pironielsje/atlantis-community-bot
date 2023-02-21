const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const redditfetch = require('reddit-fetch')

module.exports = {
    category: "Information",
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription("Gives a random meme."),
    async execute(client, interaction) {

        redditfetch({
            subreddit: 'memes' || 'dankmemes',
            sort: 'hot',
            allowNSFW: true,
            allowModPost: false,
            allowCrossPost: false,
            allowVideo: true
        }).then(post => {
            const embed = new EmbedBuilder()
                .setTitle(post.title)
                .setColor(0x0000ff)
                .setImage(post.url_overridden_by_dest)
                .setFooter({text: `👍 ${post.ups} 💬 ${post.num_comments}`})
            
            interaction.reply({embeds: [embed]})
        })

    }
};