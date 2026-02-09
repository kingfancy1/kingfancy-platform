import { SlashCommandBuilder } from 'discord.js';

const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
const EXECUTIVE_ROLE_ID = process.env.EXECUTIVE_ROLE_ID;

export default {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename the current ticket')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('New ticket name')
        .setRequired(true)
    ),

  async execute(interaction) {
    const member = interaction.member;

    if (
      !member.roles.cache.has(STAFF_ROLE_ID) &&
      !member.roles.cache.has(EXECUTIVE_ROLE_ID)
    ) {
      return interaction.reply({
        content: 'Only KingFancy Staff can rename tickets.',
        ephemeral: true
      });
    }

    const newName = interaction.options.getString('name');
    const channel = interaction.channel;

    await channel.setName(newName);

    await interaction.reply({
      content: `✏️ Ticket renamed to **${newName}**`,
      ephemeral: false
    });
  }
};
