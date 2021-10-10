/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const config = require('../../../utils/config.json');

module.exports.run = async (client, message, args, utils) => {
	const guildData = await utils.findOrCreateGuild(client, { id: message.guild.id });
	const userData = await utils.findOrCreateUser(client, { id: message.author.id });
// code here
};

module.exports.help = {
	aliases: ['aliases'],
	name: 'name',
	description: 'description',
	usage: config.prefix + 'usage',
};

module.exports.config = {
	args: false,
	restricted: false,
	category: 'category',
	disable: false,
	cooldown: 1000,
};