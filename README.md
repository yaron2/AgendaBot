# AgendaBot
Agenda Bot is a chat bot built upon Bot Framework by Microsoft. Agenda Bot will connect to event data and provide info about sessions, times, and more.


## Prerequisites
First, you'll need to [register your bot](dev.botframework.com), and  create a [LUIS account](luis.ai).
Follow the tutorial at the Bot Framework site and be sure to download the Bot Emulator to debug your bot.

## Usage
Several environment variables are needed to be passed to the bot.

appId - Your Bot AppId from the Bot Framework site.
appSecret - Your Bot AppSecret from the Bot Framework site.
dataFilePath - The location of the json file containing the session data.
timeZone - The time zone which the bot will work with. For example: "+0200"
luisEndpoint - this is the API endpoint of  your luis app from luis.ai
