import { Client } from "./structure/Client";
import path from "path";
import { config } from "dotenv";

config();

export const client = new Client({ 
  intents: [
    "GUILDS", 
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MEMBERS",
  ],
  partials: [
    "CHANNEL",
    "GUILD_MEMBER",
    "REACTION",
  ]
});

const commandManager = client.commandManager;

commandManager.verbose = true;
commandManager.registerCommands(path.resolve(__dirname, "./commands"));

commandManager.registerCommandNotFoundHandler((msg, cmdName) => {
  msg.channel.send(`Cannot find command "${cmdName}"`);
})

commandManager.registerCommandOnThrottleHandler((msg, cmd, timeLeft) => {
  const time = (timeLeft / 1000).toFixed(2);
  msg.channel.send(`You cannot run ${cmd.name} command after ${time} s`);
})

commandManager.registerCommandErrorHandler((err, msg) => {
  msg.channel.send((err as Error).message);
})

client.on("ready", () => console.log(client.user?.username, "is ready!"))
client.on("messageCreate", msg => commandManager.handleMessage(msg));

client.login(process.env.BOT_TOKEN);
