const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class LookupCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resolve',
      memberName: 'resolve',
	  aliases: ['lookup', 'ip', 'whois'],
      group: 'other',
      description:
        'Resolve an IP address or hostname with additional info.',
      throttling: {
        usages: 2,
        duration: 12
      },
      args: [
        {
          key: 'text',
          prompt:
            'What do you want to lookup? Please enter a hostname/domain or IP address.',
          type: 'string',
          validate: function(text) {
            return text.length < 50;
          }
        }
      ]
    });
  }

  async run(message, { text }) {
	  const resl = text
    // text needs to be less than 3000 length

    try {
		// fetch json data from ip-api.com
      var res = await fetch(`http://ip-api.com/json/${text}`);

	  // json results
      const json = await res.json();
	  function embedResolve(text) {
		  //embed json results
      return new MessageEmbed()
        .setColor('#42aaf5')
        .setTitle('IP/Hostname Lookup')
		.addFields(
		{ name: 'Query', value: resl, inline: true },
		{ name: 'Resolves', value: json.query, inline: true },
		{ name: '‎', value: "‎", inline: true },
		{ name: 'Location', value: `${json.city}, ${json.zip}, ${json.regionName}, ${json.country}`, inline: false },
		{ name: 'ORG', value: `${json.org}‎`, inline: true },
		{ name: 'ISP', value: json.isp, inline: true },
		{ name: 'OBO', value: json.as, inline: false },
	)
        .setTimestamp(); //img here
    }
      message.channel.send(embedResolve(json.isp));
    } catch (e) {
      console.error(e);
      return message.say(
        'Something went wrong looking for that result, is the api throttled?'
      );
    }


  }
};