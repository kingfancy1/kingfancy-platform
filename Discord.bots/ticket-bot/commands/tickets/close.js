import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Ticket from '../../models/Ticket.js';

const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
const EXECUTIVE_ROLE_ID = process.env.EXECUTIVE_ROLE_ID;
const TICKET_LOG_CHANNEL_ID = process.env.TICKET_LOG_CHANNEL_ID;

export default {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket'),

  async execute(interaction) {
    const member = interaction.member;

    // Permission check
    if (
      !member.roles.cache.has(STAFF_ROLE_ID) &&
      !member.roles.cache.has(EXECUTIVE_ROLE_ID)
    ) {
      return interaction.reply({
        content: 'Only KingFancy Staff can close tickets.',
        ephemeral: true
      });
    }

    const channel = interaction.channel;

    // Find ticket in DB
    const ticket = await Ticket.findOne({ channelId: channel.id });
    if (!ticket) {
      return interaction.reply({
        content: 'This channel is not a ticket.',
        ephemeral: true
      });
    }

    // Update DB
    ticket.status = 'closed';
    await ticket.save();

    // Log
    const logChannel = interaction.guild.channels.cache.get(TICKET_LOG_CHANNEL_ID);
    if (logChannel) {
      logChannel.send({
        content: `🛑 Ticket **#${ticket.ticketNumber}** closed by <@${member.id}>`
      });
    }

    await interaction.reply({
      content: 'Ticket closed. This channel will be deleted in 5 seconds.',
      ephemeral: false
    });

    setTimeout(() => {
      channel.delete().catch(() => {});
    }, 5000);
  }
};
