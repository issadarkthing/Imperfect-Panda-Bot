import { CommandManager } from "@jiman24/commandment";
import { Client as DiscordClient } from "discord.js";
import Enmap from "enmap";

export class Client extends DiscordClient {
  players = new Enmap("Player");
  commandManager = new CommandManager(process.env.PREFIX || "p!");
  adminID = "766211129306251274";
  devID = "264010327023288323";
}
