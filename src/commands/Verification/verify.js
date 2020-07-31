const { Command } = require('klasa');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Verify your Habbo account using the code given to you.',
			usage: '<HabboName:string>'
		});
	}

	async run(message, [habbo]) {
		if (message.member.roles.cache.has(message.guild.settings.get('verified'))) throw 'You are already verified.';
		if (!message.author.settings.get('verificationCode')) throw `You don't have a code! Please run \`${message.guild.settings.get('prefix')}getcode\` to get your code.`;

		const request = await fetch(`https://api.habboapi.net/habbos?hotel=habbo.com&name=${encodeURIComponent(habbo)}`).then(res => res.json());
		if (request.error) throw 'We could not find a Habbo user with that name!';
		if (request.motto !== `${message.guild.settings.get('codePrefix')}-${message.author.settings.get('verificationCode')}`) throw 'Please make sure your motto and the code I sent you are the same!';

		message.member.roles.remove(message.guild.settings.get('notVerified')).catch(() => null);
		message.member.roles.add(message.guild.settings.get('verified')).catch(() => {
			throw 'I could not give your the verified role due to some issues, usually with permissions. If issue persists, please contact the server\'s administrator.';
		});
	}

};