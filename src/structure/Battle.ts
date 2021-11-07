import { Panda, BaseStatsKey, stringify } from "./Panda";
import { ButtonHandler } from "@jiman24/discord.js-button";
import { Message, MessageEmbed, User } from "discord.js";
import { Player } from "./Player";
import { bold } from "../utils";
import { oneLine } from "common-tags";


export class Battle {
  private panda1: Panda;
  private panda2: Panda;
  private player1: Player;
  private player2: Player;
  private panda1initHealth: number;
  private panda2initHealth: number;
  private round = 0;
  private msg: Message;

  constructor(msg: Message, player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;

    const panda1 = player1.activePanda;
    const panda2 = player2.activePanda;

    if (!panda1 || !panda2) throw new Error(`${player1.name} has no active panda!`);

    this.panda1 = panda1;
    this.panda2 = panda2;
    this.msg = msg;
    this.panda1initHealth = this.panda1.hp;
    this.panda2initHealth = this.panda2.hp;
  }


  private bar(progress: number, maxProgress: number) {
    if (progress < 0) progress = 0;

    const maxFill = 20;
    const fill = "█";
    const path = " ";
    const fillProgress = Math.round((progress * maxFill) / maxProgress);

    return Array(maxFill)
      .fill(fill)
      .map((v, i) => (fillProgress > i ? v : path))
      .join("");
  }

  private progressBar(hp: number, maxHP: number) {

    const maxHPStr = Math.round(maxHP);
    const healthBar = this.bar(hp, maxHP);
    const remainingHP = hp >= 0 ? Math.round(hp) : 0;

    return `\`${healthBar}\` \`${remainingHP}/${maxHPStr}\``;
  }

  private handleBattle(p1Action: BaseStatsKey, p2Action: BaseStatsKey) {

    const p1Lower = p1Action.toLowerCase();
    const p2Lower = p2Action.toLowerCase();

    const bothAttackMessage = (p1Damage: number, p2Damage: number) => {
      const p1DamageDealt = p1Damage > this.panda2.hp ? this.panda2.hp : p1Damage;
      const p2DamageDealt = p2Damage > this.panda1.hp ? this.panda1.hp : p2Damage;

      this.msg.channel.send(
        oneLine`${bold(this.panda1.name)} and ${bold(this.panda2.name)} both
        successfully hit each other! ${bold(this.panda1.name)} loses
        ${p1DamageDealt} hp and ${bold(this.panda2.name)} loses ${p2DamageDealt}
        hp!`
      );
    }

    const attackAndDefense = (p1: Panda, p2: Panda, p2Defense: number) => {
      const p2DamageDealt = p2Defense > p1.hp ? p1.hp : p2Defense;

      this.msg.channel.send(
        oneLine`${bold(p2.name)} successfully defended against
        ${bold(p1.name)}’s attack. ${bold(p1.name)} loses ${p2DamageDealt} hp…
        Ouch!`
      );
    }

    if (p1Action === "attack" && p2Action === "attack") {
      this.panda1.hp -= this.panda2.attack;
      this.panda2.hp -= this.panda1.attack;

      bothAttackMessage(this.panda1.attack, this.panda2.attack);

    } else if (p1Action === "magicAttack" && p2Action === "magicAttack") {
      this.panda1.hp -= this.panda2.magicAttack;
      this.panda2.hp -= this.panda1.magicAttack;

      bothAttackMessage(this.panda1.magicAttack, this.panda2.magicAttack);

    } else if (p1Action === "attack" && p2Action === "magicAttack") {
      this.panda1.hp -= this.panda2.magicAttack;
      this.panda2.hp -= this.panda1.attack;

      bothAttackMessage(this.panda1.attack, this.panda2.magicAttack);

    } else if (p1Action === "magicAttack" && p2Action === "attack") {
      this.panda1.hp -= this.panda2.attack;
      this.panda2.hp -= this.panda1.magicAttack;

      bothAttackMessage(this.panda1.magicAttack, this.panda2.attack);

    } else if (p1Lower.includes("attack") && p2Action === "defense") {
      this.panda1.hp -= this.panda2.defense;

      attackAndDefense(this.panda1, this.panda2, this.panda2.defense);

    } else if (p2Lower.includes("attack") && p1Action === "defense") {
      this.panda2.hp -= this.panda1.defense;

      attackAndDefense(this.panda2, this.panda1, this.panda1.defense);

    } else if (p1Lower.includes("attack") && p2Action === "magicDefense") {
      this.panda1.hp -= this.panda2.magicDefense;

      attackAndDefense(this.panda1, this.panda2, this.panda2.magicDefense);

    } else if (p2Lower.includes("attack") && p1Action === "magicDefense") {
      this.panda2.hp -= this.panda1.magicDefense;

      attackAndDefense(this.panda2, this.panda1, this.panda1.magicDefense);
      
    } else { // when both defense
      this.msg.channel.send(
        oneLine`${bold(this.panda1.name)} and ${bold(this.panda2.name)} both
        defended themselves and nothing happens!`
      );
    }

    if (this.panda1.hp < 0) this.panda1.hp = 0;
    if (this.panda2.hp < 0) this.panda2.hp = 0;

  }

  private async startRound() {
    this.round++;

    const embed = new MessageEmbed()
      .setTitle("Panda Battle")
      .setColor("RED")
      .addField(
        `${this.panda1.name}'s HP`, 
        this.progressBar(this.panda1.hp, this.panda1initHealth),
      )
      .addField(
        `${this.panda2.name}'s HP`, 
        this.progressBar(this.panda2.hp, this.panda2initHealth),
      );

    const menu = new ButtonHandler(this.msg, embed)
      .setFilter(user => user.id === this.player1.id || user.id === this.player2.id)
      .setMultiUser(2);

    let p1Action: BaseStatsKey | undefined;
    let p2Action: BaseStatsKey | undefined;

    const btnCallback = (action: BaseStatsKey) => {
      return (user: User) => {
        if (user.id === this.player1.id)
          p1Action = action;
        else
          p2Action = action;
      }
    }

    menu.addButton("Attack", btnCallback("attack"));
    menu.addButton("Magical Attack", btnCallback("magicAttack"));
    menu.addButton("Defense", btnCallback("defense"));
    menu.addButton("Magical Defense", btnCallback("magicDefense"));

    await menu.run();

    if (!p1Action || !p2Action) {
      throw new Error("player does not respond in time");
    }

    this.handleBattle(p1Action, p2Action);
  }

  async run() {

    this.msg.channel.send({ 
      content: "Battle start!",
      embeds: [this.panda1.show(true), this.panda2.show(true)],
    })

    while (true) {
      await this.startRound();

      if (this.panda1.hp <= 0 || this.panda2.hp <= 0) break;
    }


    const winner = this.panda1.hp > 0 ? this.player1 : this.player2;

    this.panda1.hp = this.panda1initHealth;
    this.panda2.hp = this.panda2initHealth;

    return winner;
  }
}
