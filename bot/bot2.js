require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('./config.json');
const commands = require('./commands.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', async () => {
    console.log(`🎫 Ticket System Online: ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(process.env.TICKET_BOT_TOKEN);
    try {
        await rest.put(Routes.applicationGuildCommands('1469227081069101180', config.guildId), { body: commands });
        console.log('✅ Commands Registered');
    } catch (e) { console.error(e); }
});

client.on('interactionCreate', async (interaction) => {
    // 1️⃣ Handle Slash Commands
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        // Admin Setup Command
        if (commandName === 'setup-tickets') {
            const adminId = '1460035511962828841'; 
            if (!interaction.member.roles.cache.has(adminId)) {
                return interaction.reply({ content: "❌ Admin only!", ephemeral: true });
            }

            const menu = new StringSelectMenuBuilder()
                .setCustomId('ticket_category')
                .setPlaceholder('Select a topic...')
                .addOptions([
                    { label: 'Questions', value: 'questions', emoji: '❓' },
                    { label: 'General Support', value: 'support', emoji: '🛠️' },
                    { label: 'Product Not Received', value: 'product_not_received', emoji: '📦' },
                    { label: 'VPN Support', value: 'vpn', emoji: '🌐' },
                    { label: 'FiveM Support', value: 'fivem', emoji: '🏎️' },
                    { label: 'Fortnite Support', value: 'fortnite', emoji: '⛏️' }
                ]);

            return interaction.reply({ 
                content: 'Select a category to open a ticket:', 
                components: [new ActionRowBuilder().addComponents(menu)] 
            });
        }

        // Staff Commands (Claim & Close)
        const staffId = '1460036540372881501';
        if (['claim', 'close'].includes(commandName)) {
            if (!interaction.member.roles.cache.has(staffId)) {
                return interaction.reply({ content: "❌ Staff only!", ephemeral: true });
            }

            if (commandName === 'claim') {
                return interaction.reply(`🎯 Ticket claimed by ${interaction.user}!`);
            }
            if (commandName === 'close') {
                await interaction.reply('🔒 Closing ticket in 5 seconds...');
                setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
                return;
            }
        }
    }

    // 2️⃣ Handle Menu Clicks (Creating the ticket)
    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_category') {
        const selected = interaction.values[0];
        const categoryId = config.ticketCategories[selected];

        if (!categoryId) {
            return interaction.reply({ content: "❌ Error: Category folder not found!", ephemeral: true });
        }

        await interaction.reply({ content: '✅ Creating your ticket...', ephemeral: true });

        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${selected}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                { id: config.staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
            ]
        });

        await ticketChannel.send(`Welcome ${interaction.user}! Staff will be with you shortly.`);
    }
});
client.login(process.env.TICKET_BOT_TOKEN);