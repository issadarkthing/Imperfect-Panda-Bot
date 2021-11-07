import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";



export default class extends Command {
  name = "panda";

  async exec(msg: Message) {

    const player = new Player(msg.author);
    const activePanda = player.activePanda?.show();

    if (!activePanda) {
      throw new Error("you have no active panda");
    }

    msg.channel.send({ embeds: [activePanda] });

  }
}
