import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "stats";
  aliases = ["st", "stat"];

  async exec(msg: Message, args: string[]) {

    const player = new Player(msg.author);
    const [id] = args;
    
    if (!id) {
      throw new Error("you need to provide panda id");
    }

    const panda = player.getPanda(id);

    if (!panda) {
      throw new Error("cannot find panda");
    }

    msg.channel.send({ embeds: [panda.show()] });

  }
}
