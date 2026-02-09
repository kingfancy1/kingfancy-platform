import {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Send the ticket panel'),

  async execute(interaction) {
    try {

      const embed = new EmbedBuilder()
        .setTitle('📩 KingFancy Support')
        .setDescription(
          [
            '🔒 **This form will be submitted to KingFancy Support.**',
            'Do not share passwords or sensitive information.',
            '',
            'Select a category below to open a ticket.'
          ].join('\n')
        )
        .setColor(0xff4500);

      const menu = new StringSelectMenuBuilder()
        .setCustomId('ticket_category_select')
        .setPlaceholder('Select a ticket category')
        .addOptions([
          {
            label: 'Purchase Issue',
            value: 'purchase_issue',
            description: 'Problems with your order or payment'
          },
          {
            label: 'Account Issue',
            value: 'account_issue',
            description: 'Problems accessing your account'
          },
          {
            label: 'Technical Issue',
            value: 'technical_issue',
            description: 'Errors, bugs, or technical problems'
          }
        ]);

      const row = new ActionRowBuilder().addComponents(menu);

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });

    } catch (err) {
      console.error("❌ PANEL COMMAND ERROR:", err);
      try {
        await interaction.reply({
          content: "❌ There was an error sending the panel.",
          ephemeral: true
        });
      } catch {}
    }
  }
};
