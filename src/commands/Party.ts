import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { toList } from "../utils";



export default class extends Command {
  name = "party";
  aliases = ["p"];

  async exec(msg: Message) {

    const player = new Player(msg.author);
    const pandas = toList(player.pandas.map(x => x.name)) || "none";

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Party")
      .addField("Coins", player.coins.toString())
      .setDescription(pandas);

    msg.channel.send({ embeds: [embed] });
  }
}
