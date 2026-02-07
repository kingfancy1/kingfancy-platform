const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema({
  userId: String,
  verified: Boolean,
  timestamp: { type: Date, default: Date.now },
  details: String,
});

const VerificationLog = mongoose.model('VerificationLog', verificationLogSchema);
module.exports = VerificationLog;


const LogSchema = new mongoose.Schema({
  userId: String,
  username: String,
  action: String,        // VERIFIED, CAPTCHA_FAIL, TICKET_OPEN, etc
  details: Object,       // flexible data
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(console.error);
const Log = require('./models/Log');

await Log.create({
  userId: interaction.user.id,
  username: interaction.user.tag,
  action: 'VERIFIED',
  details: {
    method: 'captcha',
    channel: interaction.channel.id
  }
});
const accountAgeMs = Date.now() - interaction.user.createdTimestamp;
const daysOld = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));

if (daysOld < 7) {
  await Log.create({
    userId: interaction.user.id,
    username: interaction.user.tag,
    action: 'YOUNG_ACCOUNT',
    details: { daysOld }
  });

  // require harder captcha or flag
}
const a = Math.floor(Math.random() * 10);
const b = Math.floor(Math.random() * 10);
captchaAnswers.set(userId, a + b);

await interaction.reply({
  content: `🧠 CAPTCHA: What is **${a} + ${b}**?`,
  ephemeral: true
});
// Later, when checking answer
client.on('channelCreate', async (channel) => {
  if (channel.name.includes('ticket')) {
    await Log.create({
      action: 'TICKET_OPEN',
      details: {
        channelId: channel.id,
        name: channel.name
      }
    });
  }
});
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const addedRoles = newMember.roles.cache.filter(
    r => !oldMember.roles.cache.has(r.id)
  );

  for (const role of addedRoles.values()) {
    await Log.create({
      userId: newMember.id,
      username: newMember.user.tag,
      action: 'ROLE_GRANTED',
      details: { role: role.name }
    });
  }
});
app.get('/logs', async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});
