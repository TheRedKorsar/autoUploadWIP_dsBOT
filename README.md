# autoUploadWIP_dsBOT
Discord bot that automaticly download WIP map from your discord server

- Installation:<br>
Download latest realise from https://github.com/TheRedKorsar/autoUploadWIP_dsBOT/releases<br>
Extract files from zip to any folder you want;<br>
Open config.json;<br>
token: is the token of bot in discord;<br>
max_size: is the maximum size of the map in megabytes that allowed to drop;<br>
wip_folder: destination of your WIP folder with double dashes, and also double dash at the end required;<br>
wip_channel: name of the channel, where mappers will throw maps;<br>
sound_volume: 1-100 volume of sound to play 0 to mute;<br>
After config file is set up, you have to check if your discord bot is on the server;<br>
Also bot checking all channels on all servers where bot is with name that you placed in "wip_channel";<br>
After all set up you can run discord_bot.exe;<br>
mplayer.exe - tool to play sound (that not needed if sound_volume is 0).<br>
<br>

- Usage:<br>
To use that bot mappers simply has to upload zip file with the map to your wip_channel;<br>
After bot end downloading it will throw a reply to mapper, that map was downloaded;<br>
If you have sound_volume greater than 0 so you get sound notification;<br>
If not, mapper has to told you that map is downloaded;<br>
After that you have to reload songs with any method (R on game screen or refresh songs button mod).<br>
