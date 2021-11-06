import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Panda } from "../structure/Panda";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "stats";
  aliases = ["st", "stat"];

  async exec(msg: Message, args: string[]) {

    const player = new Player(msg.author);
    const [arg1] = args;
    
    if (!arg1) {
      throw new Error("you need to provide panda id");
    }

    const id = Panda.cleanID(arg1);
    const panda = player.pandas.find(panda => panda.id === id);

    if (!panda) {
      throw new Error("cannot find panda");
    }

    msg.channel.send({ embeds: [panda.show()] });

  }
}
