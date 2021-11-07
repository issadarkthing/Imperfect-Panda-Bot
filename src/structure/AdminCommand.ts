import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { client } from "..";


export abstract class AdminCommand extends Command {

  execute(msg: Message, args: string[]) {

    const admins = [client.adminID, client.devID];

    if (!admins.includes(msg.author.id)) {
      throw new Error("only admins can use this command");
    }

    return super.execute(msg, args);
  }
}
