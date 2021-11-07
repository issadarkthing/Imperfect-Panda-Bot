import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Battle } from "../structure/Battle";
import { Player } from "../structure/Player";
import { bold, validateAmount, validateNumber } from "../utils";
import { ButtonHandler } from "@jiman24/discord.js-button";
import { oneLine } from "common-tags";


export default class extends Command {
  name = "battle";

  async exec(msg: Message, args: string[]) {

    const mentionedUser = msg.mentions.users.first();
    const arg1 = args[1];

    if (!mentionedUser) {
      throw new Error("you need to mention a user");

    } else if (mentionedUser.id === msg.author.id) {
      throw new Error("you cannot battle yourself");

    } else if (!arg1) {
      throw new Error("you need to specify amount to bet");

    }

    const player = new Player(msg.author);
    const amount = parseInt(arg1);

    validateNumber(amount);
    validateAmount(amount, player.coins);

    let battleRequestResult = false;

    const battleRequest = new ButtonHandler(
      msg,
      oneLine`${mentionedUser}, ${msg.author.username} is requesting to battle
      you and placed a bet of ${amount} coins. Do you accept?`,
      mentionedUser.id,
    );

    battleRequest.addButton("Accept", () => { battleRequestResult = true });
    battleRequest.addButton("Cancel", () => { battleRequestResult = false });

    await battleRequest.run();

    if (!battleRequestResult) {
      throw new Error(`${mentionedUser.username} rejected the battle request`);
    }

    const opponent = new Player(mentionedUser);

    validateAmount(amount, opponent.coins);

    player.coins -= amount;
    player.save();

    opponent.coins -= amount;
    opponent.save();

    const battle = new Battle(msg, player, opponent);
    const winner = await battle.run();

    winner.coins += (amount * 2);
    winner.save();

    msg.channel.send(`${bold(winner.name)} wins!`);
    msg.channel.send(`${bold(winner.name)} earns ${amount} coins!`);
  }
}
