import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewMessageAdresseesService {

  adressees: string[] = [];

  constructor() { }

  add(channelId: string) {
    if(this.findIndex(channelId) == -1) this.adressees.push(channelId);
  }

  remove(channelId : string) {
    let index = this.findIndex(channelId);
    if(index != -1) this.adressees.splice(index, 1);
  }

  findIndex(channelId: string) : number {
    return this.adressees.findIndex((adressee) => adressee == channelId);
  }

  empty() {
    this.adressees = [];
  }
}
