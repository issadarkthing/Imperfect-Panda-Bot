import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Battle } from "../structure/Battle";
import { Player } from "../structure/Player";
import { bold } from "../utils";



export default class extends Command {
  name = "battle";

  async exec(msg: Message) {

    const mentionedUser = msg.mentions.users.first();

    if (!mentionedUser) {
      throw new Error("you need to mention a user");
    }

    const player = new Player(msg.author);
    const opponent = new Player(mentionedUser);

    const battle = new Battle(msg, player, opponent);
    const winner = await battle.run();

    msg.channel.send(`${bold(winner.name)} wins the battle!`);
  }
}
