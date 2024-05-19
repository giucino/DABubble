import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Channel } from '../interfaces/channel.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor() {}

  private searchTerm(searchTerm: string): string {
    return searchTerm.trim().toLowerCase();
  }

  filterUsers(searchTerm: string, users: User[]): User[] {
    const lowerCaseTerm = this.searchTerm(searchTerm);
    return users.filter((user) =>
      user.name
        .split(' ')
        .some((part: string) => part.toLowerCase().startsWith(lowerCaseTerm))
    );
  }

  filterChannels(searchTerm: string, channels: Channel[]): Channel[] {
    const lowerCaseTerm = this.searchTerm(searchTerm);
    return channels.filter((channel) =>
      channel.name
        .split(' ')
        .some((part: string) => part.toLowerCase().startsWith(lowerCaseTerm))
    );
  }

  filterMessages(searchTerm: string, messages: Message[]): Message[] {
    const lowerCaseTerm = this.searchTerm(searchTerm);
    return messages.filter((message) =>
      message.message.text.toLowerCase().includes(lowerCaseTerm)
    );
  }
}
