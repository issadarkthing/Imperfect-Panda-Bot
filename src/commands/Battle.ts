import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Battle } from "../structure/Battle";
import { Player } from "../structure/Player";
import { bold } from "../utils";
import { ButtonHandler } from "@jiman24/discord.js-button";
import { oneLine } from "common-tags";


export default class extends Command {
  name = "battle";

  async exec(msg: Message) {

    const mentionedUser = msg.mentions.users.first();

    if (!mentionedUser) {
      throw new Error("you need to mention a user");

    } else if (mentionedUser.id === msg.author.id) {
      throw new Error("you cannot battle yourself");

    }

    let battleRequestResult = false;

    const battleRequest = new ButtonHandler(
      msg,
      oneLine`${mentionedUser}, ${msg.author.username} is requesting to battle
      you. Do you accept?`,
      mentionedUser.id,
    );

    battleRequest.addButton("accept", () => { battleRequestResult = true });
    battleRequest.addCloseButton();

    await battleRequest.run();

    if (!battleRequestResult) {
      throw new Error(`${mentionedUser.username} rejected the battle request`);
    }

    const player = new Player(msg.author);
    const opponent = new Player(mentionedUser);

    const battle = new Battle(msg, player, opponent);
    const winner = await battle.run();

    msg.channel.send(`${bold(winner.name)} wins the battle!`);
  }
}
