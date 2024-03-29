import { MessageEmbed } from "discord.js";
import { toList } from "../utils";

interface BaseStats {
  attack: number;
  magicAttack: number;
  defense: number;
  magicDefense: number;
  speed: number;
  hp: number;
}

export type BaseStatsKey = keyof BaseStats;

interface Attribute {
  name: string;
  value: number;
  stat: BaseStatsKey;
}

export function stringify(stat: BaseStatsKey): string {
  switch (stat) {
    case "defense":
    case "attack":
    case "speed":
    case "hp":
      return stat;
    case "magicDefense": return "magic defense";
    case "magicAttack": return "magic attack";
  }
}

export class Panda implements BaseStats {
  readonly id: string;
  avatarUrl: string;
  nickname?: string;
  hp = 100;
  attack = 5;
  magicAttack = 5;
  defense = 5;
  magicDefense = 5;
  speed = 5;
  active = false;
  attributes: Attribute[] = [];

  constructor(id: string | number, avatarUrl: string) {
    this.id = id.toString();
    this.avatarUrl = avatarUrl;
  }

  static fromObject(x: Panda) {
    const panda = new Panda(x.id, x.avatarUrl);
    Object.assign(panda, x);
    return panda;
  }

  static cleanID(id: string) {
    return id.replace(/^#/, "");
  }

  get name() {
    return this.nickname || `Panda #${this.id}`;
  }

  addAttribute(attribute: Attribute) {
    this[attribute.stat] += attribute.value;
    this.attributes.push(attribute);
  }

  show(small?: boolean) {

    const attributes = toList(this.attributes
      .map(x => `${x.name}: +${x.value} ${x.stat}`));

    const status = this.active ? "active" : "inactive";

    const description = `
    **Status**
    ${status}

    **Stats**
    Attack: ${this.attack}
    Magic Attack: ${this.magicAttack}
    Defense: ${this.defense}
    Magic Defense: ${this.magicDefense}
    Speed: ${this.speed}
    HP: ${this.hp}

    **Attributes**
    ${attributes}
    `

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(this.name)
      .setDescription(description)

    if (small) {
      embed.setThumbnail(this.avatarUrl);
    } else {
      embed.setImage(this.avatarUrl);
    }

    return embed;
  }
}
