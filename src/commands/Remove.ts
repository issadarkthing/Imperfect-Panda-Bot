import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { bold, remove } from "../utils";



export default class Remove extends Command {
  name = "remove";

  async exec(msg: Message, args: string[]) {


    const [arg1] = args;

    if (!arg1) {
      throw new Error("you need to provide panda id");
    }

    const id = arg1.replace(/^#/, "");

    const mentionedUser = msg.mentions.users.first();

    if (!mentionedUser) {
      throw new Error("you need to mention a user");
    }

    const player = new Player(mentionedUser);
    const panda = player.pandas.find(panda => panda.id === id);

    if (!panda) {
      throw new Error("cannot find panda");
    }

    player.pandas = remove(x => x.id === id, player.pandas);
    player.save();

    msg.channel.send(`successfully removed ${bold(panda.name)}!`);
  }
}