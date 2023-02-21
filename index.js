const { Client, GatewayIntentBits, Routes, Collection, EmbedBuilder, Events, AuditLogEvent, ActivityType } = require('discord.js');
const config = require('./config.json');
const fs = require('node:fs');
const { REST } = require("@discordjs/rest");
const path = require('node:path');
const ms = require('ms')

const client = new Client({ intents: [Object.keys(GatewayIntentBits)] });
client.commands = new Collection();
const slashCommands = [];

client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);

    let guildId = config.guildId;
    let clientId = config.clientId;
    let token = config.token;
    let guild = client.guilds.cache.get(guildId);

    const rest = new REST({ version: 10 }).setToken(token);

    rest.put(Routes.applicationCommands(clientId, guildId), { body: slashCommands })
        .then(() => console.log(`Succesfully registered application commands.`))
        .catch(console.error);

    const optionsPresence = [
        {
            type: ActivityType.Listening,
            name: `${client.guilds.cache.get(config.guildId).memberCount} members.`,
            status: "online"
        },
        {
            type: ActivityType.Playing,
            name: "/help for help",
            status: "online"
        },
        {
            type: ActivityType.Watching,
            name: "Poseidon feeding the fishes",
            status: "online"
        },
        {
            type: ActivityType.Watching,
            name: "over the members",
            status: "online"
        }
    ]

    setInterval(function() {

        var optionNumber = Math.floor(Math.random() * optionsPresence.length)

        client.user.setPresence({
            activities: [{ name: optionsPresence[optionNumber].name, type: optionsPresence[optionNumber].type }],
            status: optionsPresence[optionNumber].status
        })

    }, 5 * 1000);

    setInterval(function() {

        let memberStatChannel = guild.channels.cache.get("1077638573035110400")
        let botStatChannel = guild.channels.cache.get("1077638606895722527")
        let humanStatChannel = guild.channels.cache.get("1077638672402366534")

        memberStatChannel.setName(`Total Members: ${guild.memberCount}`)
        botStatChannel.setName(`Bots: ${guild.members.cache.filter(m => m.user.bot).size}`)
        humanStatChannel.setName(`Members: ${guild.memberCount - guild.members.cache.filter(m => m.user.bot).size}`)

    }, ms("30m"))

});

const commandsPath = path.join(__dirname, 'slashCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath)

    client.commands.set(command.data.name, command)
    slashCommands.push(command.data.toJSON());

    console.log(`File ${command.data.name}.js loaded! ✅`)
}

client.on('guildMemberAdd', async (member) => {

    const joinChannel = client.guilds.cache.get('1076831378471125042').channels.cache.get('1076933101063778444');
    const memberRole = member.guild.roles.cache.find(r => r.id == "1077314665291452416")

    joinChannel.send(`Welcome to the server <@${member.user.id}>! Have fun here in ${joinChannel.guild.name} as member ${joinChannel.guild.memberCount}!`);
    member.roles.add(memberRole);

})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Hmm. Something went wrong, try again later!", ephemeral: true });
    }
})

client.on(Events.ChannelCreate, async channel => {

    channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelCreate,
    })
        .then(async audit => {
            const { executor } = audit.entries.first()

            const name = channel.name;
            const id = channel.id;
            let type = channel.type;

            if (type == 0) type = 'Text'
            if (type == 2) type = 'Voice'
            if (type == 13) type = 'Stage'
            if (type == 15) type = 'Form'
            if (type == 5) type = 'Announcement'
            if (type == 4) type = 'Category'

            const embed = new EmbedBuilder()
                .setTitle("Channel Created")
                .setColor(0x32CD32)
                .addFields(
                    { name: "Channel Name", value: `${name} (<#${id}>)`, inline: false },
                    { name: "Channel Type", value: `${type}`, inline: false },
                    { name: "Channel Id", value: `${id}`, inline: false },
                    { name: "Created By", value: `<@${executor.id}>`, inline: false },
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` })

            var logChannel = await channel.guild.channels.cache.find(channel => channel.name === "mod-logs");

            logChannel.send({ embeds: [embed] })
        })

})

client.on(Events.ChannelDelete, async channel => {

    channel.guild.fetchAuditLogs({
        type: AuditLogEvent.ChannelDelete,
    })
        .then(async audit => {
            const { executor } = audit.entries.first()

            const name = channel.name;
            const id = channel.id;
            let type = channel.type;

            if (type == 0) type = 'Text'
            if (type == 2) type = 'Voice'
            if (type == 13) type = 'Stage'
            if (type == 15) type = 'Form'
            if (type == 5) type = 'Announcement'
            if (type == 4) type = 'Category'

            const embed = new EmbedBuilder()
                .setTitle("Channel Created")
                .setColor(0xff0000)
                .addFields(
                    { name: "Channel Name", value: `${name}`, inline: false },
                    { name: "Channel Type", value: `${type}`, inline: false },
                    { name: "Channel Id", value: `${id}`, inline: false },
                    { name: "Deleted By", value: `<@${executor.id}>`, inline: false },
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` })

            var logChannel = await channel.guild.channels.cache.find(channel => channel.name === "mod-logs");

            logChannel.send({ embeds: [embed] })
        })

})

client.on(Events.GuildBanAdd, async member => {

    member.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildBanAdd,
    })
        .then(async audit => {
            const { executor } = audit.entries.first()

            const name = member.user.username;
            const id = member.user.id;

            const embed = new EmbedBuilder()
                .setTitle("Member Banned")
                .setColor(0xff0000)
                .addFields(
                    { name: "Member", value: `${name} (<@${id}>)`, inline: false },
                    { name: "Member Id", value: `${id}`, inline: false },
                    { name: "Banned By", value: `<@${executor.id}>`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` })

            var logChannel = await member.guild.channels.cache.find(channel => channel.name === "mod-logs");

            logChannel.send({ embeds: [embed] })
        })

})

client.on(Events.GuildBanRemove, async member => {

    member.guild.fetchAuditLogs({
        type: AuditLogEvent.GuildBanAdd,
    })
        .then(async audit => {
            const { executor } = audit.entries.first()

            const name = member.user.username;
            const id = member.user.id;

            const embed = new EmbedBuilder()
                .setTitle("Member Unbanned")
                .setColor(0x32CD32)
                .addFields(
                    { name: "Member", value: `${name}`, inline: false },
                    { name: "Member Id", value: `${id}`, inline: false },
                    { name: "Unbanned By", value: `<@${executor.id}>`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` })

            var logChannel = await member.guild.channels.cache.find(channel => channel.name === "mod-logs");

            logChannel.send({ embeds: [embed] })
        })

})

client.on(Events.MessageDelete, async (msg) => {

    if (msg.author.bot) return;

    msg.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
    })
        .then(async audit => {
            const { executor } = audit.entries.first()

            const content = msg.content;

            if (!content) return;

            const embed = new EmbedBuilder()
                .setTitle("Message Deleted")
                .setColor(0xff0000)
                .addFields(
                    { name: "Message Content", value: `${content}`, inline: false },
                    { name: "Message Channel", value: `${msg.channel}`, inline: false },
                    { name: "Deleted By", value: `<@${msg.member.user.id}>`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` })

            var logChannel = await msg.guild.channels.cache.find(channel => channel.name === "mod-logs");

            logChannel.send({ embeds: [embed] })
        })

})

client.on(Events.MessageUpdate, async (msg, newMsg) => {

    if (msg.author.bot) return;

    msg.guild.fetchAuditLogs({
        type: AuditLogEvent.MessageUpdate,
    })
        .then(async audit => {
            const { executor } = audit.entries.first()

            const content = msg.content;

            if (!content) return;

            const embed = new EmbedBuilder()
                .setTitle("Message Edited")
                .setColor(0xFFFF00)
                .addFields(
                    { name: "Old Message", value: `${content}`, inline: false },
                    { name: "New Message", value: `${newMsg}`, inline: false },
                    { name: "Message Channel", value: `${msg.channel}`, inline: false },
                    { name: "Edited By", value: `<@${msg.member.user.id}>`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `${client.user.username}` })

            var logChannel = await msg.guild.channels.cache.find(channel => channel.name === "mod-logs");

            logChannel.send({ embeds: [embed] })
        })

})

client.login(config.token);