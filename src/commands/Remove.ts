import { Message } from "discord.js";
import { AdminCommand } from "../structure/AdminCommand";
import { Player } from "../structure/Player";
import { bold, remove } from "../utils";



export default class Remove extends AdminCommand {
  name = "remove";

  async exec(msg: Message, args: string[]) {


    const [id] = args;

    if (!id) {
      throw new Error("you need to provide panda id");
    }

    const mentionedUser = msg.mentions.users.first();

    if (!mentionedUser) {
      throw new Error("you need to mention a user");
    }

    const player = new Player(mentionedUser);
    const panda = player.getPanda(id);

    if (!panda) {
      throw new Error("cannot find panda");
    }

    player.pandas = remove(x => x.id === id, player.pandas);
    player.save();

    msg.channel.send(`successfully removed ${bold(panda.name)}!`);
  }
}
