import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";



export default class extends Command {
  name = "party";
  aliases = ["p"];

  async exec(msg: Message) {

    const player = new Player(msg.author);
    const pandas = player.pandas.map(x => x.show(true));

    if (pandas.length <= 0) {
      throw new Error("you have no panda");
    }

    msg.channel.send({ embeds: pandas });

  }
}
