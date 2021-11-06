import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { bold } from "../utils";



export default class extends Command {
  name = "activate";

  async exec(msg: Message, args: string[]) {

    const player = new Player(msg.author);
    const [id] = args;
    const panda = player.getPanda(id);

    if (!panda) {
      throw new Error("no panda found");
    }

    const activePanda = player.activePanda;

    if (activePanda) {

      activePanda.active = false;

    }
      
    panda.active = true;
    player.save();

    msg.channel.send(`Successfully activated ${bold(panda.name)}!`);
  }
}
