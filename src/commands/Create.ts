import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Panda } from "../structure/Panda";
import { Prompt } from "../structure/Prompt";
import { bold } from "../utils";


export default class extends Command {
  name = "create";
  prompt!: Prompt;

  async exec(msg: Message) {

    try {

      this.prompt = new Prompt(msg);

      const avatar = await this.getAvatar();
      const panda = new Panda(avatar.url);

      msg.channel.send({ embeds: [panda.show()] });
      const confirmation = await this.prompt.ask(
        `You are about to create ${bold(panda.name)}. Confirm? [y/n]`
      );

      if (confirmation !== "y") {
        throw new Error("panda creation was not approved");
      }

      msg.channel.send(`${bold(panda.name)} has been created successfully!`);

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
