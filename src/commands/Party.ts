import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { toNList } from "../utils";



export default class extends Command {
  name = "party";
  aliases = ["p"];

  async exec(msg: Message) {

    const player = new Player(msg.author);
    const pandas = toNList(player.pandas.map(x => x.name)) || "none";

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Party")
      .setDescription(pandas);

    msg.channel.send({ embeds: [embed] });
  }
}
