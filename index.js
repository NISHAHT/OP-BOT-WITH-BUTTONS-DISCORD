require('dotenv').config();
require('./utils/ExtendedMessage');
const Discord = require('discord.js');
const op_client = require('./utils/ops');
const AmeClient = require("amethyste-api");
 const docsUpdater = require('./docs.js')
const client = new op_client({ disableMentions: 'everyone', intents: Discord.Intents.ALL, partials: ['MESSAGE', 'USER', 'REACTION'], ws: { properties: { $browser: "Discord iOS" }}});
const client1 = new Discord.Client({ disableMentions: 'everyone', intents: Discord.Intents.ALL, partials: ['MESSAGE', 'USER', 'REACTION'], ws: { properties: { $browser: "Discord iOS" }}});


const disbut = require('discord-buttons');
disbut(client);

//require('discord-buttons')(client); // Add This
require('./utils/serverstats.js')(client);
require("./utils/inline_reply");
//require("./welcome.js")(client);
//require("./docs.js")(client);

const fs = require("fs");
const config = require("./config.json");
client.config = config;
let db = require("quick.db");
//------------------------------------------------------------------together[activiies]------------------------------\\
const { DiscordTogether } = require('discord-together'); 

client.discordTogether = new DiscordTogether(client);



//----------------------------------------------------------------------Youtube poster--------------------------------\\
const YoutubePoster = require("discord-yt-poster");
client.YTP = new YoutubePoster(client);
//-----------------------------------------------------Leveling-----------------------------------------------------------\\
client.levels = require("./utils/levels.js");

client.start(process.env.token, process.env.mongo);
const unhhook = new Discord.WebhookClient(process.env.unhandled_rejection_webhook_id, process.env.command_webhook_token);
//-----------------------------------------------Embed---------------------------------------------\\
let maincolor = "#7289d5";
client.maincolor = maincolor
client.embed = function(t, d , f)
 {
    const embed = new Discord.MessageEmbed().setColor(maincolor);
if(t){embed.title = t};
if(d){embed.description = d};
if(f){embed.footer = f};
return embed;
};
//-----------------------------------------------------------menu roles----------------------------------------\\
const Nuggies1 = require('nuggies');
client.on('clickMenu', menu => {
    Nuggies1.dropclick(client, menu);
});
//----------------------------------------------------------buton roles----------------------------------------\\
client.on('clickButton', button => {
    Nuggies1.buttonclick(client, button);
});

client.awaitReply = async(message, title, description, footer ,filter , limit) => {
  if(!limit) limit = 60000 * 2;
  if(!filter) filter = (res) => res.author.id === message.author.id;
    if(!footer) footer = "Reply with \"cancel\" to stop the process";
    
        let e = new Discord.MessageEmbed().setDescription(description).setTitle(title).setFooter(footer).setColor("RED");
        await message.channel.send(e)
        return  message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] })
          .then((collected) => {
return collected.first().content
          })
          .catch(() => false);
}

//----------------------------------------------------For any unhandled errors-----------------------------------------\\
process.on('unhandledRejection', async (err) => {
	if (client.user) {
		if (client.user.id === '848826210241740810') {
			const errEmbed = new Discord.MessageEmbed().setTitle('unhandledRejection Error').setDescription(err.stack, { code: 'ini' }).setTimestamp();
			unhhook.send(errEmbed);
		}
	}
	return console.log(err);
});


//-------------------------------------------------------------Giveaway Code--------------------------------------------\\


//------------------------------------------------------Initialise discord giveaways------------------------------------\\
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  updateCountdownEvery: 3000,
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    reaction: "🎉"
  }
});

//-------------------------------------------------------Client's GiveawaysManager Events------------------------------\\
client.giveawaysManager.on(
  "giveawayReactionAdded",
  async (giveaway, reactor, messageReaction) => {
    if (reactor.user.bot) return;
    try {
      if(giveaway.extraData){
      await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
      }
      reactor.send(
        new Discord.MessageEmbed()
          .setAuthor(`Giveaway Entry Confirmed`, `https://media.discordapp.net/attachments/737046647476846673/825811629622951936/tick.png`)
          .setTimestamp()
          .setTitle("Entery Approved! | You have a chance to win!!")
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been confirmed! \n \n <:r_invite2:865122689852637195>**[Add OP Bot](https://discord.com/oauth2/authorize?client_id=848826210241740810&permissions=1609952503&scope=bot%20applications.commands)** to your server! or <:dev:848146809025331210>**[Test It in the support server](${process.env.support})**`
          )
 
          .setFooter("GG")
          .setTimestamp()
      );
    } catch (error) {
       const guildx = client.guilds.cache.get(giveaway.extraData.server)
      messageReaction.users.remove(reactor.user);
      reactor.send( new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle(":x: Entery Denied | Databse Entery Not Found & Returned!")
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been denied as you did not join **${guildx.name}** \n **[Join OP's Guild](${process.env.support})**`
          )
   
          .setFooter("GG")
      );
    }
  }
);
//---------------------------------------Check if user reacts on an ended giveaway------------------\
client.giveawaysManager.on('endedGiveawayReactionAdded', (giveaway, member, reaction) => {
     reaction.users.remove(member.user);
     member.send(`**Aw snap! Looks Like that giveaway has already ended!**`)

});
//--------------------------------------------------Dm our winners-----------------------------------\\
client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
     winners.forEach((member) => {
         member.send(new Discord.MessageEmbed()
         .setTitle(`🎁 Let's goo!`)
         .setDescription(`Hello there ${member.user}\n I heard that you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!! \n \n <:r_invite2:865122689852637195>**[Add OP Bot](https://discord.com/oauth2/authorize?client_id=848826210241740810&permissions=1609952503&scope=bot%20applications.commands)** to your server! or <:dev:848146809025331210>**[Test It in the support server](${process.env.support})**`)
               
         .setTimestamp()
         .setFooter(member.user.username, member.user.displayAvatarURL())
         );
     });
});
//-----------------------------------------------Dm Rerolled winners----------------------------------\\
client.giveawaysManager.on('giveawayRerolled', (giveaway, winners) => {
     winners.forEach((member) => {
         member.send(new Discord.MessageEmbed()
         .setTitle(`🎁 Let's goo! We Have A New Winner`)
         .setDescription(`Hello there ${member.user}\n I heard that the host rerolled and you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!!\n \n <:r_invite2:865122689852637195>**[Add OP Bot](https://discord.com/oauth2/authorize?client_id=848826210241740810&permissions=1609952503&scope=bot%20applications.commands)** to your server! or <:dev:848146809025331210>**[Test It in the support server](${process.env.support})**`)
                  
         .setTimestamp()
         .setFooter(member.user.username, member.user.displayAvatarURL())
         );
     });
});
//--------------------------------------When They Remove Reaction---------------------------------------\\
client.giveawaysManager.on('giveawayReactionRemoved', (giveaway, member, reaction) => {
     return member.send( new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle('❓ Hold Up Did You Just Remove a Reaction From A Giveaway?')
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) was recorded but you un-reacted, since you don't need **${giveaway.prize}** I would have to choose someone else 😭 \n \n <:r_invite2:865122689852637195>**[Add OP Bot](https://discord.com/oauth2/authorize?client_id=848826210241740810&permissions=1609952503&scope=bot%20applications.commands)** to your server! or <:dev:848146809025331210>**[Test It in the support server](${process.env.support})**`
          )
                     
          .setFooter("Think It was a mistake? Go react again!")
      );
});

//-----------------------------------------------Disboard bump reminder---------------------------------------------\\

client.on('message', async message => {
    if (message.embeds.length && message.author.username == 'DISBOARD' && message.embeds[0].description.indexOf('Bump done') > -1) {
       // message.lineReply("Thanks")
 let ping;
    let bump = db.fetch(`bump_${message.guild.id}`)
if (!bump || bump === null) return;
        const role = message.guild.roles.cache.get(bump);
        if(!role) return;
    
        //message.delete();
         let ty = new Discord.MessageEmbed()
          .setDescription(
            `Thank you for bumping! Make sure to leave us a review i will remind <@&` + role.id + `> in two hours`
          )
          .setTimestamp()
          .setColor(`RANDOM`);
        
        await message.channel.send(ty);
         setTimeout(function () {
        let bumpReminder = new Discord.MessageEmbed()
          .setDescription(
            "It's been two hours, you should be able to bump the server again (unless someone else already has)."
          )
          .setTimestamp()
          .setColor(`RANDOM`);
            
         message.channel.send(`<@&`+ role.id + `>`, bumpReminder);
      }, 7200000);
    
  
} else {
        if (message.embeds.length && message.author.username == 'DISBOARD' && message.embeds[0].description.indexOf('Please wait another') > -1) {
            //message.delete();
            return message.channel.send('Bump is not ready yet');
        }
    }
});

//-------------------------------------------------------Ghost ping------------------------------------\\
client.on('guildMemberAdd', async member => {
    let ghostc = db.fetch(`ghosty_${member.guild.id}`)
    if (ghostc === null) return
	let content = `<@${member.id}>`
    member.guild.channels.cache.get(ghostc).send(content).then(msg => msg.delete({ timeout: 500 }))
})

//----------------------------------------------stats setup--------------------------------\\
const os = require('os');
const ms = require('ms');
//const db = require('quick.db');
//const disbut = require('discord-buttons');
client.on('clickButton', async (button) => {
	await button.clicker.fetch();
	button.reply.defer();
	if (button.id === 'REFRESH') {
		const btn = new disbut.MessageButton()
			.setLabel('Refresh')
			.setID('REFRESH')
			.setStyle('blurple');
		const statembed = new Discord.MessageEmbed()
			.setAuthor(
				`${client.user.username} Statistics`,
				client.user.displayAvatarURL(),
			)
			.setFooter('©️ OP Bot')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setColor('RANDOM').setDescription(`**❯ Total Guilds : **${
				client.guilds.cache.size
			} Guilds
    **❯ Total Users : **${client.guilds.cache.reduce(
		(a, b) => a + b.memberCount,
		0,
	)} Users
    **❯ Total Channels: **${client.channels.cache.size} Channels
    **❯ Uptime: **${ms(client.uptime, { long: true })}
    **❯ Discord.js version: **v${Discord.version}
    **❯ Arch: **${os.arch()}
    **❯ Platform: **${os.platform()}
    **❯ CPU: **${os.cpus().map((i) => `${i.model}`)[0]}
    **❯ Memory Usage: **${(
		process.memoryUsage().heapUsed /
			1024 /
			1024
	).toFixed(2)} MB/${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB
    **❯ Last Updated at: **<t:${Math.floor(Date.now() / 1000)}>`);
		const msg = await db.get(button.message.guild.id);
		const m = await button.message.channel.messages.fetch(msg);
		m.edit({
            embed: statembed,
            button: btn
        });
	}
});

//-------------------------------------------Invite manger-------------------------------\\
const guildInvites = new Map();
  
  client.on("inviteCreate", async invite =>
    guildInvites.set(invite.guild.id, await invite.guild.fetchInvites())
  );
  client.on("ready", () => {
      
    client.guilds.cache.forEach(guild => {
      guild
        .fetchInvites()
        .then(invites => guildInvites.set(guild.id, invites))
        .catch(err => console.log(`Error fetching invites of ${guild.name}`));
    });
  });
  
  client.on("guildMemberAdd", async member => {
      let join = db.get(`join_channel_${member.guild.id}`)
    const catchedInvites = guildInvites.get(member.guild.id);
  const newInvites = await member.guild.fetchInvites();
  guildInvites.set(member.guild.id, newInvites);
  try {
    const usedInvite = newInvites.find(
      inv => catchedInvites.get(inv.code).uses < inv.uses
    );
    if (member.user.bot) {
        return join.send(`${member.username} Joined by OAuth2`)
    }
    // db.set(`author_${member.guild.id}_${member.id}`, usedInvite.inviter.id);
    if(!usedInvite) {
      let vanity = config.unkown.split("[user]")
      .join(client.users.cache.get(member.id).username)
      .split("[inviter]")
      .join(client.users.cache.get(usedInvite.inviter.id).username)
      .split("[invites]")
      .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.invites`))
      .split("[total]")
      .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.regular`))
      .split("[leaves]")
      .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.leaves`))
      .split("[jointimes]")
      .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.joins`))
       member.guild.channels.cache.get(join).send(vanity)
    
    let user = db.get(`invites_${member.guild.id}_${member.id}`)
    if(!user) {
    let data = { 
      invites: 0,
      regular: 0,
      leaves: 0,
      joins: 0,
      by: client.users.cache.get(usedInvite.inviter.id).username,
      bouns: 0   
    }
    db.set(`invites_${member.guild.id}_${member.id}`, data) 
    }
    }
    if(!usedInvite) return;
    db.add(`invites_${member.guild.id}_${member.id}.joins`, 1)
    let invites = db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}`)
    if(!invites) {
      let brr = { 
        invites: 0,
        regular: 0,
        leaves: 0,
        joins: 0,
        by: client.users.cache.get(usedInvite.inviter.id).username,
        bouns: 0   
      }
      db.set(`invites_${member.guild.id}_${usedInvite.inviter.id}`, brr)
    }
    db.set(`author_${member.guild.id}_${member.id}`, usedInvite.inviter.id);  
    db.add(`invites_${member.guild.id}_${usedInvite.inviter.id}.invites`, 1)

    db.add(`invites_${member.guild.id}_${usedInvite.inviter.id}.regular`, 1)
    
    //let join = db.get(`join_channel_${member.guild.id}`)
    let customize = db.get(`join_message_${member.guild.id}`)
    if(!customize) customize = config.join
    if(!join) return;
    let splita = customize
    .split("[user]")
    .join(client.users.cache.get(member.id).username)
    .split("[inviter]")
    .join(client.users.cache.get(usedInvite.inviter.id).username)
    .split("[invites]")
    .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.invites`))
    .split("[total]")
    .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.regular`))
    .split("[leaves]")
    .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.regular`))
    .split("[jointimes]")
    .join(db.get(`invites_${member.guild.id}_${usedInvite.inviter.id}.joins`))

     member.guild.channels.cache.get(join).send(splita)
 
  } catch (err) {
  console.log(err)
  }
  })
  client.on("guildMemberRemove", member => {
    try {
  let user = db.get(`author_${member.guild.id}_${member.id}`)
  if(!user) {
   let channel = db.get(`leave_channel_${member.guild.id}`)
   if(!channel) return;
   member.guild.channels.cache.get(channel).send(`${member.username} has left, but i can't figure out who invited him.`)
   return
  }

  let channel = db.get(`leave_channel_${member.guild.id}`)
  if(!channel) return;
  let leave = db.get(`leave_message_${member.guild.id}`)
  if(!leave) leave = config.leave;
  db.add(`invites_${member.guild.id}_${user}.leaves`, 1)
  db.subtract(`invites_${member.guild.id}_${user}.invites`, 1)
  let com = leave.split("[user]")
  .join(client.users.cache.get(member.id).username)
  .split("[inviter]")
  .join(client.users.cache.get(user).username)
  .split("[invites]")
  .join(db.get(`invites_${member.guild.id}_${user}.invites`))
  .split("[total]")
  .join(db.get(`invites_${member.guild.id}_${user}.regular`))
  .split("[leaves]")
  .join(db.get(`invites_${member.guild.id}_${user}.leaves`))
  .split("[jointimes]")
  .join(db.get(`invites_${member.guild.id}_${user}.joins`))

  member.guild.channels.cache.get(channel).send(com)
     } catch(err) {
      console.log(err)
    }
  })


 setInterval(() => {
client.guilds.cache.forEach(x =>{
  let ranks = db.get(`ranks_${x.id}`)
  if(!ranks) return;
  x.members.cache.forEach(o => {
  if(o.user.bot === true) return;
    let invites = db.get(`invites_${x.id}_${o.id}`)
    if(!invites) {
      let data = {
        invites: 0,
        regular: 0,
        leaves: 0,
        joins: 0,
        by: null,
        bouns: 0       
      }
      db.set(`invites_${x.id}_${o.id}`, data)
    return; 
    }    
    ranks.forEach(r => {
      let g = x.roles.cache.get(r.role)
if(!g) return;
x.members.fetch(o.id).then(member => {  
if(invites.invites > r.invites-1) {
       if(member.roles.cache.has(r.role)) return
        member.roles.add(r.role, { reason: "has enough invites" })
       db.set(`r_${x.id}_${o.id}_${r.role}`, true)
    }
    if(invites.invites < r.invites-1) {
     // console.log(member.user.username)
      if(member.roles.cache.has(r.role)) {
        let check = db.get(`r_${x.id}_${o.id}_${r.role}`)
        if(!check) return;
        member.roles.remove(r.role, { reason: "don't have enough invites for the role"})
        db.delete(`r_${x.id}_${o.id}_${r.role}`)
      } 
      }
    })
    })
  })
})
 }, 5500);
//------------------------------------Welcome-----------------------------------\\
client.on('guildMemberAdd', async member => {
    const Canvas = require("canvas")
  var validator = require('validator');
const { weirdToNormalChars } = require('weird-to-normal-chars');
    const { centerText } = require("./utils/welcomeUtils.js");
    Canvas.registerFont("./assets/Geizer.otf", {
  family: "Geizer"
})
Canvas.registerFont("./assets/Captain.otf", {
  family: "Captain"
});
Canvas.registerFont("./assets/bourbon.ttf", {
  family: "Bourbon"
});
let font = db.get(`font_${member.guild.id}`)
  let welback = db.get(`welback1_${member.guild.id}`); //background
  let welchannl = db.get(`welchannl1_${member.guild.id}`); //channel
  let welmsg = db.get(`welmsg1_${member.guild.id}`); //message
  if (!welchannl) return;
  if (welmsg) {
    welmsg = welmsg.replace(/{user}/g, member);
    welmsg = welmsg.replace(/{server}/g, member.guild.name);
    welmsg = welmsg.replace(/{membercount}/g, member.guild.memberCount);
    welmsg = welmsg.replace(/{username}/g, member.user.tag);
    let matches = welmsg.match(/{:([a-zA-Z0-9-_~]+)}/g);
    if (!matches) matches = welmsg;
    for (const match of matches) {
      const rep = await member.guild.emojis.cache.find(
        emoji => emoji.name === match.substring(2, match.length - 1)
      );
      if (rep) welmsg = welmsg.replace(match, rep);
    }
  }
  let welc = db.get(`welcolor1_${member.guild.id}`); //welcome color
  let usrc = db.get(`usrcolor1_${member.guild.id}`);
  const canvas = Canvas.createCanvas(883, 431);
  const ctx = canvas.getContext("2d");
  let choices = [
    "https://media.discordapp.net/attachments/741712646361055333/743530826343514253/Best-HD-Backgrounds-Photos-Download.jpg?width=766&height=431",
    "https://media.discordapp.net/attachments/741712646361055333/743530817388806225/Best-PC-HD-Wallpapers-008.jpg?width=766&height=431",
    "https://media.discordapp.net/attachments/741712646361055333/743530777160974397/images.jpg?width=766&height=431"
  ];
  let response = choices[Math.floor(Math.random() * choices.length)];
  const background = await Canvas.loadImage(
    welback ||
      "https://media.discordapp.net/attachments/696417925418057789/744447998490312714/060.png?width=766&height=431"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.font = `70px ${font}`;
  ctx.fillStyle = welc || "#ffffff";
  centerText(ctx, "Welcome", canvas.height / 1.2, canvas);
  //ctx.fillText("Welcome", canvas.width / 2.6, canvas.height / 1.2);
  // Add an exclamation point here and below
  ctx.font = `55px ${font}`;
  ctx.fillStyle = usrc || "#ffffff";
  //let x = 512-(ctx.measureText(member.user.tag).width/2)
  //ctx.fillText(`${weirdToNormalChars(member.user.tag)}`, x, 200);//ok first i am making the canvas like koya
  centerText(ctx, weirdToNormalChars(member.user.tag), 410, canvas);
  ctx.beginPath();
  const back1 = await Canvas.loadImage(
    "https://cdn.glitch.com/e8fae0a6-f8d2-4180-9cf2-2a337ef27413%2Fa40b8840-4bae-425f-b1d6-649c62e7fca2.image.png?v=1597409272378"
  );
  ctx.drawImage(back1, 303, 23, 275, 275);
  ctx.lineWidth = 10;
  //Define Stroke Style
  ctx.strokeStyle = "#03A9F4";
  ctx.arc(440, 160, 130, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "jpg" }));
  ctx.drawImage(avatar, 310, 30, 270, 270);

  const attach = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png");
  let embed = db.get(`emb_${member.guild.id}`);
  if (embed == null) {
    client.channels.cache.get(welchannl).send(welmsg || "", attach);
  } else {
let h = db.get(`ec_${member.guild.id}`);
if(!h || !validator.isHexColor(h)) h = "#00FF00";
    const embed = new Discord.MessageEmbed()
      .setDescription(welmsg || "")
      .setColor(h) //thik ha na //yes embed  custom kardo
      .attachFiles([new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png")])
      .setImage("attachment://welcome.png");
    client.channels.cache.get(welchannl).send(embed); //acha laga ga
  } //ab setup/welcome.js main ayo
})
/*
//-------------------------------------------------MOD LOGS----------------------------------------\\
client.on("channelPinsUpdate", function(channel, time){
    if(!channel.guild) return;
//const { MessageEmbed } = require("discord.js");
const guild = channel.guild;
 if (!guild.me.hasPermission("MANAGE_WEBHOOKS")) return;
    const w = await guild.fetchWebhooks();
    const log = w.find((w) => w.name === "OP Logger");
if(log) {

const embed = new Discord.MessageEmbed() 
.setColor("GREY") 
.setFooter(`Channel ID: ${channel.id}`)
.setTimestamp() 
.setTitle(`Channel Pins Updated`)
.addField(`❯ Channel`, `${channel.toString()} (${channel.id})`) 
.addField(`❯ Pinned At`, time)
return log.send({
username: "OP Bot", 
avatarURL: "https://cdn.discordapp.com/emojis/865122693259198495.png", 
embeds: [embed]
})


}
});
*/
//dm logs
client.on('message', async message => {
if (message.channel.type == "dm") {
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("DM Received:")
      .addField(`Member:`, `<@!${message.author.id}> (${message.author.id})`)
      .addField("Message:", message.content, false)
      .setTimestamp()
      .setColor(`RANDOM`);
    const c = client.channels.cache.get(`868100323275853865`)
    c.send(embed)
      
  }

  if (!message.guild) {
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("DM Received:")
      .setDescription(
        "Hi there! Sadly you can't run commands in the DMs. Also note that any messages you have sent will been sent to my developers, not the guild that may have issued an infraction."
      )
      .addField("Bot Support", "[Click Here](https://discord.gg/QUeKG73UZ6)")
      .setTimestamp()
      .setColor(`RED`);
    return message.lineReply(embed);
  }
}); 

//----------------------------------------------------------------------------------------------------\\
/*
client.on("presenceUpdate", async function(oldMember, newMember){
     let old = oldMember;
let New = newMember;
if(old.member.user.bot) {
const { MessageEmbed } = require("discord.js");
const guild = old.guild;
 if (!guild.me.hasPermission("MANAGE_WEBHOOKS")) return;
    const w = await guild.fetchWebhooks();
    const log = w.find((w) => w.name === "OP Downtime");
if(log) {
     if (newMember.status === 'offline') {
   
    var uptimerate = db.fetch(`rate_${newMember.userID}`);
  
if(!uptimerate)
      {
             var uptimerate = "99";
             db.set(`rate_${newMember.userID}`, 99)
      }
      
      var timetest = db.fetch(`timefr_${newMember.userID}`)
      var timetest = Date.now() - timetest;
      let breh = db.fetch(`lastoffline`)
     
      if(timetest > 60000)
      {
      
         db.set(`presence_${newMember.userID}`, "offline")
          db.set(`timefr_${newMember.userID}`, Date.now())
       db.add(`offlinechecks_${newMember.userID}`, 1)
        if(breh === newMember.userID)
      {
        return;
      }
         return log.send({
username: "OP Downtime Notifier", 
avatarURL: "https://cdn.discordapp.com/emojis/865122693259198495.png", 
embeds: `<@${newMember.userID}> is Offline And Uptime Rate - ${uptimerate}%`
})
      // client.channels.cache.get("858984429481623593").send(`<@${newPresence.userID}> is Offline And Uptime Rate - ${uptimerate}%`) 
} 
  }
if (newMember.status === 'online') {
    let check = db.fetch(`presence_${newMember.userID}`);
    if(check === "offline")
    {

      var uptimerate = db.fetch(`rate_${newMember.userID}`);
   
   if(!uptimerate)
      {
             var uptimerate = "99";
      }
        
        db.delete(`presence_${newMember.userID}`, "online")
        
        let to2 = db.fetch(`timefr_${newMember.userID}`);
        var timeleft = await ms(Date.now() - to2);
        var hour = timeleft.hours;
       var minutes = timeleft.minutes;
       var seconds = timeleft.seconds;
    
       db.set(`lastoffline`, newMember.userID);
         return log.send({
username: "OP Downtime Notifier", 
avatarURL: "https://cdn.discordapp.com/emojis/865122693259198495.png", 
embeds: `<@${newMember.userID}> is Online And Uptime Rate - ${uptimerate}% And was Offline for ${hour}h ${minutes}m ${seconds}s`
})
      // client.channels.cache.get("858984429481623593").send(`<@${newPresence.userID}> is Online And Uptime Rate - ${uptimerate}% And was Offline for ${hour}h ${minutes}m ${seconds}s`) 
       db.set(`timefr_${newMember.userID}`, Date.now())
    }
    }

}
} else {
    return;
}
});
*/
client.on('clickButton', button => {
   
     
   if(button.id == 1) {
      // await button.reply.defer()
     //  await button.reply.think(true)
       //await button.reply.send('')
        button.reply.send('Join This to recieve your prize https://discord.gg/vUYvswzwMH', { ephemeral: true })
   } 
});
