import { MessageEmbed } from "discord.js";
import { client } from "..";
import { toList } from "../utils";

interface BaseStats {
  attack: number;
  magicAttack: number;
  defense: number;
  magicDefense: number;
  speed: number;
}

export type BaseStatsKey = keyof BaseStats;

interface Attribute {
  name: string;
  value: number;
  stat: BaseStatsKey;
}

export class Panda implements BaseStats {
  id = client.players.autonum;
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

  addAttribute(attribute: Attribute) {
    this[attribute.stat] += attribute.value;
    this.attributes.push(attribute);
  }

  show() {

    const attributes = toList(this.attributes
      .map(x => `${x.name}: +${x.value} ${x.stat}`));

    const description = `
    **Stats**
    Attack: ${this.attack}
    Magic Attack: ${this.magicAttack}
    Defense: ${this.defense}
    Magic Defense: ${this.magicDefense}
    Speed: ${this.speed}

    **Attributes**
    ${attributes}
    `

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(this.name)
      .setImage(this.avatarUrl)
      .setDescription(description)

    return embed;
  }
}
