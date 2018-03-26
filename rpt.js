const Discord = require('discord.js')
const Google = require('./commands/google')
const Ping = require('./commands/ping')
const Facebook = require('./commands/facebook')
const Twitter = require('./commands/twitter')
const YouTube = require('./commands/youtube')
const Botname = require('./commands/botname')
const token = "";
const client = new Discord.Client();
const Wiki = require('wikijs')
const weather = require('weather-js')
const express = require('express');
var app = express();
var yt = require("./youtube_plugin");
var youtube_plugin = new yt();
var AuthDetails = require("./auth.json");
var RedisSessions = require("redis-sessions");
var rs = new RedisSessions();
var Music = require("./music.js");
var functionHelper = require('./functionHelpers.js');
var ffmpeg = require("ffmpeg");
var search = require('youtube-search');
var moment = require("moment");
music = new Music();
var prefix = "!";
var mention = "<@317641593349865472>";
const opts = {
  maxResults: 10,
  key: AuthDetails.youtube_api_key
};

client.on("ready", () => {
    var memberCount = client.users.size;
    var servercount = client.guilds.size;
	var servers = client.guilds.array().map(g => g.name).join(',');
	console.log("--------------------------------------");
	console.log('[!]Connexion en cours... \n[!]Veuillez Patienté! \n[!]Chargement..  \n[!]Les préfix actuelle:  ' + prefix + "\n[!]Mentions = " + mention + "\n[!]Nombre de membres: " + memberCount + "\n[!]Nombre de serveurs: " + servercount);
	client.user.setUsername('RPT').catch(console.error);
	client.user.setAvatar('./potion.jpg').catch(console.error);
    client.user.setActivity('Alchimie Bot', { type: 'WATCHING' }).catch(console.error); //type activité PLAYING STREAMING LISTENING WATCHING
    client.user.setStatus('online').catch(console.error) //type status : online idle invisible dnd (do not disturb)

});


client.on('guildMemberAdd', function (member) {
	member.createDM().then(function (channel) {
		return channel.send('Bienvenue sur le serveur phénécie, moi je suis le bot du serveur enchanté :) ! Si vous avez des questions ou suggestions merci de contacter Shiromada. ' + member.displayName)
	}).catch(console.error)
});

client.on('voiceStateUpdate', (oldMember, newMember)=>{
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  if(!oldUserChannel) return; //Si il était pas dans une chaine.
  console.log("========================");
  console.log("Premier OK");
  console.log("La chaine a été créé par moi : "+oldUserChannel.cMoiQuiACree);
  if(oldUserChannel.cMoiQuiACree){
    console.log("Deuxiéme OK");
    console.log("Nombre de personnes restantes : "+(oldUserChannel.members.size))
    if((oldUserChannel.members.size)==0){
      console.log("Troisiéme OK");
      oldUserChannel.delete().catch(e=>console.log("J'ai pas de perms")).then(()=>console.log("TOTALEMENT OK"));

    }   
  }
  
})

client.on('message', async function (message) { 
    Google.parse(message)
    Ping.parse(message)
    Facebook.parse(message)
    Twitter.parse(message)
    YouTube.parse(message)


  if (message.content.startsWith('!duo')){
  if (!message.guild) return;
  var server = message.guild;
  var name = message.author.username;
 let ChaineVocal = await message.guild.createChannel('JEVAISDEVENIRFOUUUUUU','VOICE')
     .catch(console.error)
     .then(c=>c.setUserLimit(2),() => console.log(`Moved ${member.displayName}`))
     ChaineVocal.cMoiQuiACree = true; //Pour qu'on puisse reconnaitre que la chaine a été créé par le bot plus tard.
     if (message.member.voiceChannel){
       GuildChannel = message.channel;
       message.member.setVoiceChannel(ChaineVocal.id)
      let la_categorie = message.guild.channels.find(c=> c.name.toLowerCase()==="black desert online"&&c.type==="category")
      console.log(la_categorie.id)
      ChaineVocal.setParent(la_categorie)  
       message.reply("Vous avez créer un chanel Duo :crossed_swords: ")
     } else {
       message.reply('Vous avez créer un chanel Duo :crossed_swords: vous pouvez vous y connecter !')
     }
   }else if (message.content.startsWith('!delete')){
     var array_msg = message.content.split(' ');
     
   }
});


var messages = [];
client.on('message', message => {
   music.setVoiceChannel(message.member.voiceChannel);
    var array_msg = message.content.split(' ');
            messages.push(message);
            switch (array_msg[0]) {
        case ("!play") :
            console.log("Play");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            else music.voice();
            message.reply("Lancement de votre musique bonne écoute !:grin: :notes:  ")
            break;
        case ("!pause") :
            console.log("Pause");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            music.pause();
            message.reply("Votre musique est en pause. :sleeping:  ")
            break;
        case ("!resume") :
            console.log("Resume");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            music.resume();
            message.reply("Reprise de votre musique. :notes:")
            break;
        case ("!stop") :
            console.log("Stop");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            else music.stop();
            message.reply("La file d'attente à était vidé !:grin: ");
            break;
        case ("!add") :
            console.log("Add");
            message.delete(message.author);
            var link = message.content.split(' ');
            link.shift();
            link = link.join(' ');
            search(link, opts, function(err, results) {
                if(err) return console.log(err);
                for (var y = 0; results[y].kind == 'youtube#channel'; y++);
                message.channel.sendMessage(results[y].link);
                music.setTabEnd(results[y].link);
            });
            message.reply("Musique ajouter avec succès ! :grin:")
            break;
        case ("!link") :
            console.log("Link");
            message.delete(message.author);
            var link = message.content.split(' ');
            link.shift();
            link = link.join(' ');
            console.log(link);
            music.setTabEnd(link);
            break;
        case ("!volume") :
            console.log("Volume");
            message.delete(message.author);
            var link = message.content.split(' ');
            link.shift();
            link = link.join(' ');
            music.volume(link/100);
            message.reply("le volume est maintenant à :" + link);
            break;
        case ("!next") :
            console.log("Next");
            //message.reply("Commande pas encore optimiser (bug) N'espère pas de me kill !:japanese_ogre:  ")
            message.delete(message.author);
            if (music.getI() < music.getLengthTab()) music.setI(this.i + 1);
            if (music.getI() >= music.getLengthTab()) music.setI(0);
            music.next();
            break;
            }
 if(message.content.startsWith('!botname')){
    client.user.setUsername(message.content.substr(9));
 }else if (message.content.startsWith('!say')){
    console.log("say");
    message.delete(message.author);
    var say = message.content.substr(5);
    message.channel.send(say);
}else if (message.content === ("!channel")){
    const data = client.channels.get(message.channel.id);
    moment.locale("fr");
    var temps = moment(data.createdTimestamp).format("LLLL");
    console.log(temps)
    message.reply("\n" + "```javascript"+ "\n" + "Nom du channel: " + data.name + "\n" + "Type de channel: " + data.type + "\n" +
    "Channel id: " + data.id + "\n" + "Topic: " + data.topic + "\n" + "Créer le: " + temps + "```" );
    console.log("\n" + "**" + "Channel id: " + data.id + "**" );
    console.log(data);
 
}else if (message.content.startsWith('!météo')){
    var location = message.content.substr(6);
    var unit = "C";
    
    try {
        weather.find({search: location, degreeType: unit}, function(err, data) {
            if(err) {
                console.log(Date.now(), "DANGER", "Je ne peut pas trouvé d'information pour la méteo de " + location);
                message.reply("\n" + "Je ne peut pas trouvé d'information pour la méteo de " + location);
            } else {
                data = data[0];
               console.log("**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
               message.reply("\n" + "**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
            }
        });
    } catch(err) {
        console.log(Date.now(), "ERREUR", "Weather.JS a rencontré une erreur");
        message.reply("It's a problem..");
        }
    
}
 else if(message.content.startsWith('!kick')){
            let modRole = message.guild.roles.find("name", "Mod");
if(!message.member.roles.has(modRole.id)) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
    if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour Kick! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
if(message.mentions.users.size === 0) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez Kick. **Format ~> `!kick @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
}
let kickMember = message.guild.member(message.mentions.users.first());
if(!kickMember) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
}
if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
  return message.reply("Je n'ai pas la permissions ** __(KICK_MEMBERS)__ **!").catch(console.error);
}
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Phénécie."
}
}}).catch(console.error);
}   
kickMember.kick().then(member => {
    message.channel.sendMessage("", {embed: {
          title: "Succès :white_check_mark:",
          color: 0xff0000,
          description: `${member.user.username}`+` à bien été kick`,
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: kickMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: kickMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "Kick",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: kickMember.user.username + "#"+ kickMember.user.discriminator,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
 else if(message.content.startsWith('!ban')){
            let modRole = message.guild.roles.find("name", "Mod");
if(!message.member.roles.has(modRole.id)) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
    if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour Kick! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
if(message.mentions.users.size === 0) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez Kick. **Format ~> `!ban @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
}
let banMember = message.guild.member(message.mentions.users.first());
if(!banMember) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
}
if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
  return message.reply("Je n'ai pas la permissions ** __(BAN_MEMBERS)__ **!").catch(console.error);
}
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Phénécie."
}
}}).catch(console.error);
}   
banMember.kick().then(member => {
    message.channel.sendMessage("", {embed: {
          title: "Succès :white_check_mark:",
          color: 0xff0000,
          description: `${member.user.username}`+` à bien été ban`,
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: banMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: banMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "ban",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: banMember.user.username + "#"+ banMember.user.discriminator,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        else if(message.content.startsWith('!mute')){
            let modRole = message.guild.roles.find("name", "Mod");
    if(!message.guild.roles.exists("name", "mute")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **mute** n'existe pas dans ce serveur veuillez le créer pour Mute! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(modRole.id)) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
      if(message.mentions.users.size === 0) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez mute totalment. **Format ~> `!mute @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      }
      let muteMember = message.guild.member(message.mentions.users.first());
      if(!muteMember) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      }
      if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Je n'ai pas la permissions pour faire cela __(MANAGE_MESSAGES)__ !").catch(console.error);
      }
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Phénécie."
}
}}).catch(console.error);
}     
let mutedRole = message.guild.roles.find("name", "mute");
    var time = 500000;
    console.log(muteMember);
      muteMember.addRole(mutedRole).then(member => {
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :white_check_mark:  Vous avez bien mute ** "+ muteMember + " dans le serveur "+message.guild.name  + " ! :white_check_mark: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: muteMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: muteMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "mute total",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: muteMember.user.username,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        )}
       else if(message.content.startsWith('!unmute')){
            let modRole = message.guild.roles.find("name", "Mod");
            if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour unmute! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      }
    if(!message.guild.roles.exists("name", "mute")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **mute** n'existe pas dans ce serveur veuillez le créer pour Unmute! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(modRole.id)) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
      if(message.mentions.users.size === 0) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez unmute totalment. **Format ~> `!unmute @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      }
      let muteMember = message.guild.member(message.mentions.users.first());
      if(!muteMember) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      }
      if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Je n'ai pas la permissions pour faire cela __(MANAGE_MESSAGES)__ !").catch(console.error);
      }
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Phénécie."
}
}}).catch(console.error);
}   
let mutedRole = message.guild.roles.find("name", "mute");
    var time = 500000;
    console.log(muteMember);
      muteMember.removeRole(mutedRole).then(member => {
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :white_check_mark:  Vous avez bien unmute ** "+ muteMember + " dans le serveur "+message.guild.name  + " ! :white_check_mark: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: muteMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: muteMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "unmute total",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: muteMember.user.username,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        )}else if (message.content.startsWith("!clear")) {
      let modRole = message.guild.roles.find("name", "Mod");
            if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour Clear! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(modRole.id)) {
        return   message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Phénécie."
          }
        }}).catch(console.error);
      }
    var args = message.content.substr(7);
      if(args.length === 0){
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x: Vous n'avez pas précisser le nombre :x: ",
          footer: {
            text: "Message par Phénécie."
          }
        }});
      }
      else {
        var msg;
        if(args.length === 1){
        msg = 2;
      } else {
        msg = parseInt(args[1]);
      }
      message.channel.fetchMessages({limit: msg}).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
      message.channel.sendMessage("", {embed: {
        title: "Success!",
        color: 0x06DF00,
        description: "Messages Suprimé!",
        footer: {
          text: "Message par Phénécie."
        }
      }});
      }
}
else if (message.content.startsWith('!youtube')){
youtube_plugin.respond(message.content, message.channel , client);
}else if (message.content.startsWith('!phenecie')){
  var memberCount = client.users.size;
  var servercount = client.guilds.size;
  var prefix = "!";
  message.reply("Voici les informations sur le bot Phénécie \n Pseudo: @Phénécie#6007 \n créateur: @Onlinet#9078 aka Shiromada \n Le préfix actuelle est : " + prefix + "\n Nombres  de serveurs sur le quelle je suis connecter : " + servercount + "\n Nombres au total de personnes : " + memberCount  ).catch(console.error).then(console.log)



}



});

app.get('/', function (req, res) {
    var obj = new Object();
    obj.test = "Test moi";
    obj.rep = "test réussi !";
    var json = JSON.stringify(obj);
    res.send(json);
});

app.get('/playlist', function (req, res) {
    var json = JSON.stringify(music.tab);
    res.send(json);
});

app.listen(AuthDetails.port);
client.login(token)