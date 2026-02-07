require('dotenv').config();
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('./config.json');
const commands = require('./commands.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
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

client.login(process.env.VERIFY_BOT_TOKEN);