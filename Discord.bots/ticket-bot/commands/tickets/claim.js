import { SlashCommandBuilder } from 'discord.js';
import Ticket from '../../models/Ticket.js';

const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
const EXECUTIVE_ROLE_ID = process.env.EXECUTIVE_ROLE_ID;

export default {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Claim the current ticket'),

  async execute(interaction) {
    const member = interaction.member;

    if (
      !member.roles.cache.has(STAFF_ROLE_ID) &&
      !member.roles.cache.has(EXECUTIVE_ROLE_ID)
    ) {
      return interaction.reply({
        content: 'Only KingFancy Staff can claim tickets.',
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

    await interaction.reply({
      content: `🎟️ Ticket claimed by <@${member.id}>`,
      ephemeral: false
    });
  }
};
