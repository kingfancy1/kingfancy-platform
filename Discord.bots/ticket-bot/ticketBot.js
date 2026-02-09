import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath, pathToFileURL } from 'url';
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Collection
} from 'discord.js';

// Fix Windows __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const {
  TICKET_BOT_TOKEN,
  GUILD_ID,
  MONGO_URI
} = process.env;

if (!TICKET_BOT_TOKEN) throw new Error('Missing TICKET_BOT_TOKEN');
if (!GUILD_ID) throw new Error('Missing GUILD_ID');
if (!MONGO_URI) throw new Error('Missing MONGO_URI');

// Connect to MongoDB
await mongoose.connect(MONGO_URI);
console.log('✅ Ticket bot connected to MongoDB');

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.commands = new Collection();


// ⭐ FIXED COMMAND LOADER (Windows + ESM safe)
async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const categories = fs.readdirSync(commandsPath);

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);

      // Convert Windows path → file:// URL
      const commandURL = pathToFileURL(filePath).href;

      const commandModule = await import(commandURL);
      const command = commandModule.default;

      if (!command?.data || !command?.execute) {
        console.warn(`⚠️ Invalid command file: ${filePath}`);
        continue;
      }

      if (client.commands.has(command.data.name)) {
        console.warn(`⚠️ Duplicate command skipped: ${command.data.name}`);
        continue;
      }

      client.commands.set(command.data.name, command);
    }
  }

  console.log(`✅ Loaded ${client.commands.size} commands`);
}


// ⭐ REGISTER SLASH COMMANDS
async function registerSlashCommands() {
  const rest = new REST({ version: '10' }).setToken(TICKET_BOT_TOKEN);
  const commandsJSON = [...client.commands.values()].map(cmd => cmd.data.toJSON());

  await rest.put(
    Routes.applicationGuildCommands(client.user.id, GUILD_ID),
    { body: commandsJSON }
  );

  console.log('✅ Slash commands registered');
}


// ⭐ FIXED EVENT LOADER (Windows + ESM safe)
async function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const files = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(eventsPath, file);

    const eventURL = pathToFileURL(filePath).href;

    const eventModule = await import(eventURL);
    const event = eventModule.default;

    const eventName = file.replace('.js', '');
    client.on(eventName, (...args) => event(client, ...args));
  }

  console.log('✅ Events loaded');
}


// ⭐ READY EVENT
client.once('ready', async () => {
  console.log(`✅ Ticket bot logged in as ${client.user.tag}`);
  await registerSlashCommands();
});


// ⭐ STARTUP
await loadCommands();
await loadEvents();

client.once('ready', async () => {
  await registerSlashCommands();
});

client.login(TICKET_BOT_TOKEN);
