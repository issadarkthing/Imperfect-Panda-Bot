import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";



export default class extends Command {
  name = "party";

  async exec(msg: Message) {

    msg.channel.send("hello world");
  }
}
