import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { validateIndex, validateNumber } from "../utils";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "stats";
  aliases = ["st"];

  async exec(msg: Message, args: string[]) {

    const player = new Player(msg.author);
    const index = parseInt(args[0]) - 1;

    validateNumber(index);
    validateIndex(index, player.pandas);

    const panda = player.pandas[index];

    msg.channel.send({ embeds: [panda.show()] });

  }
}
