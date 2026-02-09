import Ticket from '../models/Ticket.js';
import {
  ChannelType,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} from 'discord.js';

const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID;
const EXECUTIVE_ROLE_ID = process.env.EXECUTIVE_ROLE_ID;
const TICKET_LOG_CHANNEL_ID = process.env.TICKET_LOG_CHANNEL_ID;

export default async function interactionCreate(client, interaction) {

  // Debug to confirm file is loaded
  console.log("🔥 interactionCreate.js is running");

  // ⭐ 1. Handle dropdown selection → show modal
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'ticket_category_select') {

      const category = interaction.values[0];

      // ⭐ FULL PURCHASE SUPPORT MODAL
      const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${category}`)
        .setTitle('KingFancy Support Ticket');

      const productName = new TextInputBuilder()
        .setCustomId('product_name')
        .setLabel('Product Name *')
        .setPlaceholder('Example: Netflix, FiveM, Fortnite, VPN, etc.')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const orderEmail = new TextInputBuilder()
        .setCustomId('order_email')
        .setLabel('Order Email *')
        .setPlaceholder('Email used during purchase')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const orderId = new TextInputBuilder()
        .setCustomId('order_id')
        .setLabel('Order ID *')
        .setPlaceholder('Copy ID from your receipt')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const description = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Problem Description *')
        .setPlaceholder('Short explanation of the issue')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(productName),
        new ActionRowBuilder().addComponents(orderEmail),
        new ActionRowBuilder().addComponents(orderId),
        new ActionRowBuilder().addComponents(description)
      );

      return interaction.showModal(modal);
    }
  }

  // ⭐ 2. Handle modal submission → create ticket
  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('ticket_modal_')) {

      const categoryKey = interaction.customId.replace('ticket_modal_', '');

      const productName = interaction.fields.getTextInputValue('product_name');
      const orderEmail = interaction.fields.getTextInputValue('order_email');
      const orderId = interaction.fields.getTextInputValue('order_id');
      const description = interaction.fields.getTextInputValue('description');

      const count = await Ticket.countDocuments();
      const ticketNumber = count + 1;

      const channel = await interaction.guild.channels.create({
        name: `ticket-${ticketNumber}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          },
          {
            id: STAFF_ROLE_ID,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          },
          {
            id: EXECUTIVE_ROLE_ID,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          }
        ]
      });

      await Ticket.create({
        ticketNumber,
        userId: interaction.user.id,
        channelId: channel.id,
        categoryKey,
        status: 'open'
      });

      const embed = new EmbedBuilder()
        .setTitle(`🎫 Ticket #${ticketNumber}`)
        .setDescription(
          [
            `**User:** <@${interaction.user.id}>`,
            `**Category:** ${categoryKey}`,
            ``,
            `**Product Name:** ${productName}`,
            `**Order Email:** ${orderEmail}`,
            `**Order ID:** ${orderId}`,
            ``,
            `**Problem Description:**`,
            `${description}`
          ].join('\n')
        )
        .setColor(0xff4500)
        .setTimestamp();

      await channel.send({
        content: `<@&${STAFF_ROLE_ID}> New ticket created!`,
        embeds: [embed]
      });

      const logChannel = interaction.guild.channels.cache.get(TICKET_LOG_CHANNEL_ID);
      if (logChannel) {
        logChannel.send({
          content: `📩 New ticket **#${ticketNumber}** created by <@${interaction.user.id}>`
        });
      }

      return interaction.reply({
        content: `Your ticket has been created: <#${channel.id}>`,
        ephemeral: true
      });
    }
  }
}
