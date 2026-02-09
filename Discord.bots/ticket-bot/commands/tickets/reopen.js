import { SlashCommandBuilder } from 'discord.js';
import Ticket from '../../models/Ticket.js';

const EXECUTIVE_ROLE_ID = process.env.EXECUTIVE_ROLE_ID;
const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
export default {
  data: new SlashCommandBuilder()
    .setName('reopen')
    .setDescription('Reopen a closed ticket'),

  async execute(interaction) {
    const member = interaction.member;

    if (!member.roles.cache.has(EXECUTIVE_ROLE_ID)) {
      return interaction.reply({
        content: 'Only KingFancy Executives can reopen tickets.',
        ephemeral: true
      });
    }

    const channel = interaction.channel;

    const ticket = await Ticket.findOne({ channelId: channel.id });
    if (!ticket) {
      return interaction.reply({
        content: 'This channel is not a ticket.',
        ephemeral: true
      });
    }

    ticket.status = 'open';
    await ticket.save();

    await interaction.reply({
      content: `🔓 Ticket reopened by <@${member.id}>`,
      ephemeral: false
    });
  }
};
