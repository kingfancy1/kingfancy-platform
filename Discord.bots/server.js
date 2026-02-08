require('dotenv').config();
const { spawn } = require('child_process');

console.log('🚀 Starting KingFancy Discord Bot System...\n');

const requiredEnvVars = ['VERIFY_BOT_TOKEN', 'TICKET_BOT_TOKEN', 'MONGODB_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars.join(', '));
  process.exit(1);
}

console.log('🛡️  Starting Verification Bot...');
const verifyBot = spawn('node', ['bot.js'], {
  stdio: 'inherit',
  env: process.env
});

console.log('🎫 Starting Ticket Bot...');
const ticketBot = spawn('node', ['bot2.js'], {
  stdio: 'inherit',
  env: process.env
});

verifyBot.on('error', (error) => {
  console.error('❌ Verify Bot Error:', error);
});

verifyBot.on('close', (code) => {
  console.log(`🛡️  Verify Bot exited with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Restarting Verify Bot in 5 seconds...');
    setTimeout(() => {
      spawn('node', ['bot.js'], { stdio: 'inherit', env: process.env });
    }, 5000);
  }
});

ticketBot.on('error', (error) => {
  console.error('❌ Ticket Bot Error:', error);
});

ticketBot.on('close', (code) => {
  console.log(`🎫 Ticket Bot exited with code ${code}`);
  if (code !== 0) {
    console.log('🔄 Restarting Ticket Bot in 5 seconds...');
    setTimeout(() => {
      spawn('node', ['bot2.js'], { stdio: 'inherit', env: process.env });
    }, 5000);
  }
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  verifyBot.kill('SIGTERM');
  ticketBot.kill('SIGTERM');
  setTimeout(() => process.exit(0), 2000);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Received SIGTERM, shutting down...');
  verifyBot.kill('SIGTERM');
  ticketBot.kill('SIGTERM');
  setTimeout(() => process.exit(0), 2000);
});

console.log('\n✅ Bot system started successfully!');
console.log('🛑 Press Ctrl+C to stop\n');