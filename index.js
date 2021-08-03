var config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const wip_chan = config.wip_channel;
const player = require('play-sound')(opts = {player: "mplayer"})
const request = require('request');
const fs = require('fs');
const JSZip = require("jszip");
const play_sound = config.sound_volume;

const WIP_FOLDER = config.wip_folder; //path to WIP folder
const max_file = config.max_size; // max file size in MB

const fileReg = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$|([<>:"\/\\|?*])|(\.|\s)$/ig

function download(url, fname, msg){ // just function of download the zip
	let ws = fs.createWriteStream(fname)
    let req = request.get(url).on('error', console.error)
    req.pipe(ws);
	req.on('end', function () {
		file_downloaded(fname, msg);
	})
}

function file_downloaded(fname, msg){
	console.log(`File downloaded: ${fname}!`);
	let files;
	// read a zip file
	fs.readFile(fname, function(err, data) {
		if (err) throw err;
		JSZip.loadAsync(data).then(function (zip) {
			// Get list of filenames, which are also keys for additional details
			files = Object.keys(zip.files);
			let folder_in_folder = false; // Some mappers sends maps as folder in folder and some not
			let f_name = ""; // this will be actual name of the folder where map goes
			let contain_info_dat = false; // to check if zip file is valid we will check only info.dat file
			for(i=0; i< files.length; i++){ // loop through all files in zip
				let inf_dat = files[i].substring(files[i].length-8, files[i].length); // if file info.dat in folder we need to get it name any way
				if (inf_dat.toLowerCase() == "info.dat"){ // Some editors makes file Info.dat, and some info.dat, lets lowercase it all
					contain_info_dat = true; // valid zip file
					if (files[i].length > 8){ // Check for folder in folder, if info.dat is in the folder so path will be longer that name of the file itself
						folder_in_folder = true; // If it is so make variable to true
						f_name = files[i].substring(0, files[i].length-9); // also we name new folder to extract files
					}
				}
				if (!folder_in_folder){ // if it is not folder in folder, so we name future folder as zip file
					f_name = fname.substring(0, fname.length-4);
				}
				// console.log(files[i] + " " + zip.files[files[i]].dir);
			}
			if (!folder_in_folder){
				console.log("File: " + fname + " is folder in folder.");
			}else{
				console.log("File: " + fname + " is not folder in folder.");
			}
			if (!contain_info_dat){ // if file is incorrect, we well throw bot reply, that mapfile is incorrect
				msg.reply(`file is incorrect!`);
				return;
			}

			if (reg.test(f_name)) { // if filename is invalid, we well throw bot reply
				msg.reply(`file name is invlid!`);
				console.log("Filename: " + f_name + " is invlid.");
				return;
			}


			console.log("File: " + fname + " is correct, unzipping...");
			// Now we ready to put files to WIP folder
			if (!fs.existsSync(WIP_FOLDER + f_name)){
				fs.mkdirSync(WIP_FOLDER + f_name);
			}
			console.log("Unzipping to: " + WIP_FOLDER + f_name);
			fs.readFile(fname, function(err, data) {
				if (!err) {
					var zip = new JSZip();
					zip.loadAsync(data).then(function(contents) {
						Object.keys(contents.files).forEach(function(filename) {
							if (!zip.files[filename].dir){
								zip.file(filename).async('nodebuffer').then(function(content) {
									if (folder_in_folder){
										let dest = WIP_FOLDER + filename;
										fs.writeFileSync(dest, content);
									}else{
										let dest = WIP_FOLDER + f_name + "\\" + filename;
										fs.writeFileSync(dest, content);
									}
								});
							}
						});
					});
				}
			});
			msg.reply(`file was uploaded!`);
			
			fs.unlink(fname, function(err, data) { // delete downloaded file
				if (!err) {
					console.log("ZIP File deleted!");
				}
			});
			if (play_sound*1 > 0){
				console.log("Play sound");
				player.play('wip_ready.mp3', {afplay: ['-volume', play_sound ]}, function(err){ if (err) throw err}); // there we need to call streamer that map is ready, and he need to reload maps
			}
		});
	});
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', msg => {
    if(msg.channel.name == wip_chan && msg.attachments.first()){ //checks if an attachment is sent to wip-channel
		if(msg.attachments.first().size > max_file * 1024 * 1024){ // check size of the file, we don't want trolls that sends 1tb files
			msg.reply(`file of the zip cant be more that ${max_file}mb!!!`); // reply to that troll
			return;
		}
		let str = msg.attachments.first().name;
		console.log(`Filename: ${str}`);
		let res = str.substring(str.length-3, str.length);
        if(res.toLowerCase() == 'zip'){//Download only zip 
            download(msg.attachments.first().url, str, msg);//Function I will show later
			console.log(`Downloadign ${msg.attachments.first().url}!`);
        }
    }
  // if (msg.content === 'ping') { // just for test, that bot is alive
    // msg.reply(`Pong!`);
  // }
  // if (msg.content === '!file') {
    // msg.channel.send("Testing message.", {
	  // files: [
		// "./wip_ready.mp3"
	  // ]
	// });
  // }
});

client.login(config.token); // token key that you need to get from creating bot
