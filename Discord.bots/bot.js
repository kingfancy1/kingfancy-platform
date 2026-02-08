require('dotenv').config();
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('./config.json');
const commands = require('./commands.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Verification Bot Database Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

client.once('ready', async () => {
  console.log(`🛡️ Verification Bot Online: ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(process.env.VERIFY_BOT_TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands('1468876733074772095', config.guildId),
      { body: commands }
    );
    console.log('✅ Verify Commands Registered');
  } catch (error) {
    console.error('❌ Registration Error:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'verify') {
    if (interaction.member.roles.cache.has(config.verifiedRoleId)) {
      return interaction.reply({ content: '✅ You are already verified!', ephemeral: true });
    }

    const verifyButton = new ButtonBuilder()
      .setCustomId('verify_button')
      .setLabel('Verify')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(verifyButton);

    const embed = new EmbedBuilder()
      .setTitle('🛡️ Verification Required')
      .setDescription('Click the button below to verify and gain access to the server.')
      .setColor('#00ff00')
      .setFooter({ text: 'KingFancy Security System' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verify_button') {
    try {
      await interaction.member.roles.add(config.verifiedRoleId);
      
      await interaction.update({
        content: '✅ **Verification Successful!** You now have access to the server.',
        embeds: [],
        components: []
      });

      if (config.logChannelId) {
        const logChannel = await client.channels.fetch(config.logChannelId);
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setTitle('✅ New Verification')
            .setDescription(`${interaction.user} has been verified!`)
            .addFields(
              { name: 'User ID', value: interaction.user.id, inline: true },
              { name: 'Username', value: interaction.user.tag, inline: true }
            )
            .setColor('#00ff00')
            .setTimestamp();
          
          await logChannel.send({ embeds: [logEmbed] });
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      await interaction.reply({ content: '❌ Verification failed. Contact an admin.', ephemeral: true });
    }
  }
});

client.on('error', error => console.error('Client error:', error));
process.on('unhandledRejection', error => console.error('Unhandled rejection:', error));

client.login(process.env.VERIFY_BOT_TOKEN);