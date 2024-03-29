import { Message } from "discord.js";
import { AdminCommand } from "../structure/AdminCommand";
import { Player } from "../structure/Player";
import { validateNumber } from "../utils";



export default class extends AdminCommand {
  name = "give";

  async exec(msg: Message, args: string[]) {

    const mentionedUser = msg.mentions.users.first();

    if (!mentionedUser) {
      throw new Error("please mention a user");
    }

    const arg1 = args[1];
    const amount = parseInt(arg1);

    validateNumber(amount);

    const player = new Player(mentionedUser);

    player.coins += amount;
    player.save();

    msg.channel.send(`Successfully given ${amount} bamboo to ${player.name}!`);
  }
}
