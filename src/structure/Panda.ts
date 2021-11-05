import { MessageEmbed } from "discord.js";
import shortUUID from "short-uuid";
import { inlineCode } from "../utils";

interface BaseStats {
  attack: number;
  magicAttack: number;
  defense: number;
  magicDefense: number;
  speed: number;
}

type BaseStatsKey = keyof BaseStats;

interface Attribute {
  name: string;
  value: number;
  stat: BaseStatsKey;
}

export class Panda implements BaseStats {
  id = shortUUID.generate();
  avatarUrl: string;
  nickname?: string;
  hp = 100;
  attack = 5;
  magicAttack = 5;
  defense = 5;
  magicDefense = 5;
  speed = 5;
  attributes: Attribute[] = [];

  constructor(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }

  static fromObject(x: Panda) {
    const panda = new Panda(x.avatarUrl);
    Object.assign(panda, x);
    return panda;
  }

  get name() {
    return this.nickname || `Panda #${this.id}`;
  }

  show() {

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(this.name)
      .setImage(this.avatarUrl)
      .addField("Attack", inlineCode(this.attack), true)
      .addField("Magic Attack", inlineCode(this.magicAttack), true)
      .addField("Defense", inlineCode(this.defense), true)
      .addField("Magic Defense", inlineCode(this.magicDefense), true)
      .addField("Speed", inlineCode(this.speed), true)

    return embed;
  }
}
