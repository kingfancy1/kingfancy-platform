const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Send verification message')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription('Create the ticket opening panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Claim this ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close this ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .toJSON(),
];