import { User } from "discord.js";
import { Panda } from "./Panda";
import { client } from "../index";


export class Player {
  name: string;
  user: User;
  pandas: Panda[] = [];
  coins = 0;

  constructor(user: User) {
    this.user = user;
    this.name = user.username;

    const player = client.players.get(this.id);
    if (player) {
      Object.assign(this, player);
    }

    this.pandas = this.pandas.map(x => Panda.fromObject(x));
  }

  get id() {
    return this.user.id;
  }

  getPanda(id: string) {
    const cleanID = Panda.cleanID(id);
    return this.pandas.find(x => x.id === cleanID || x.nickname === id);
  }

  save() {
    const { user, ...others } = this;
    client.players.set(this.id, others);
  }
}
