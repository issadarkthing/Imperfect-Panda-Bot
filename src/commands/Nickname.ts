import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { bold } from "../utils";


export default class extends Command {
  name = "nickname";

  async exec(msg: Message, args: string[]) {

    const [id, nickname] = args;
    if (!id) {
      throw new Error("please provide id or nickname");
    } else if (!nickname) {
      throw new Error("please provide a new nickname");
    }

    const player = new Player(msg.author);
    const panda = player.getPanda(id);
    const nicknameTaken = player.getPanda(nickname);

    if (!panda) {
      throw new Error("cannot find panda");

    } else if (nicknameTaken) {
      throw new Error("you already have a panda with that nickname");

    }

    const oldName = panda.name;

    panda.nickname = nickname;
    player.save();

    msg.channel.send(`Successfully change ${bold(oldName)} to ${bold(panda.name)}!`);
  }
}
