import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";



export default class extends Command {
  name = "party";
  aliases = ["p"];

  async exec(msg: Message) {

    const player = new Player(msg.author);
    const pandas = player.pandas.map(x => x.show(true));

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .addField("Bamboo", player.coins.toString(), true)

    msg.channel.send({ embeds: [...pandas, embed] });
  }
}
