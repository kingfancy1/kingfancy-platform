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
];