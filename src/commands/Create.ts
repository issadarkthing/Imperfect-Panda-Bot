import { Command } from "@jiman24/commandment";
import { oneLine } from "common-tags";
import { Message } from "discord.js";
import { BaseStatsKey, Panda } from "../structure/Panda";
import { Player } from "../structure/Player";
import { Prompt } from "../structure/Prompt";
import { bold, validateNumber } from "../utils";


export default class extends Command {
  name = "create";
  aliases = ["c"];
  private stats  = new Map<string, BaseStatsKey>()
    .set("attack", "attack")
    .set("magic attack", "magicAttack")
    .set("defense", "defense")
    .set("magic defense", "magicDefense")
    .set("speed", "speed");
  prompt!: Prompt;

  async exec(msg: Message) {

    try {

      this.prompt = new Prompt(msg);

      const avatar = await this.getAvatar();
      const panda = new Panda(avatar.url);

      const addAttribute = await this.prompt
        .ask("Do you want to add attribute? [y/n]");

      if (addAttribute === "y") {

        while (true) {

          const attributeName = await this.prompt
            .ask("Please give an attribute name. **Example**: Straw hat");

          const validStats = [...this.stats.keys()].join(", ");

          const stats = await this.prompt.ask(
            oneLine`Please give this attribute a stat. Valid stats are
            ${validStats}. **Example**: 10 magic attack`
          );

          const [valueStr, ...attrib] = stats.split(/\s+/);
          const value = parseInt(valueStr);
          const attribKey = attrib.join(" ");
          const attribute = this.stats.get(attrib.join(" "));

          validateNumber(value);
          if (!attribute) throw new Error("invalid attribute");

          panda.addAttribute({ name: attributeName, value, stat: attribute });
          msg.channel.send(
            oneLine`Successfully added ${attributeName}: +${value} ${attribKey}
            to ${bold(panda.name)}`
          );

          const confirmation = await this.prompt
            .ask("Do you want to continue adding attributes? [y/n]");

          if (confirmation === "n") break;
        }
      }


      msg.channel.send({ embeds: [panda.show()] });
      const confirmation = await this.prompt.ask(
        `You are about to create ${bold(panda.name)}. Confirm? [y/n]`
      );

      if (confirmation !== "y") {
        throw new Error("panda creation was not approved");
      }

      msg.channel.send(`${bold(panda.name)} has been created successfully!`);

      const collected = await this.prompt.collect(
        "Please mention an owner for this panda", 
        { max: 1 },
      );

      const owner = collected.mentions.users.first();

      if (!owner) throw new Error("no user was mentioned");

      const player = new Player(owner);
      player.pandas.push(panda);

      msg.channel.send(
        oneLine`${bold(panda.name)} has been successfully transferred to
        ${bold(owner.username)}!`
      )

      player.save();

    } catch (e) {
      const err = e as Error;
      msg.channel.send(err.message);
      msg.channel.send("operation failed");
    }
  }

  async getAvatar() {

    const collected = await this.prompt.collect(
      `Please upload an image for panda`,
      { max: 1 },
    );

    const image = collected.attachments.first();

    if (!image) {
      throw new Error("no image was uploaded");
    }

    return image;
  }
}
