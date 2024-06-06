import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Channel } from '../interfaces/channel.interface';
import { Message } from '../interfaces/message.interface';
import { UserService } from '../firebase.service/user.service';
import { ChannelFirebaseService } from '../firebase.service/channelFirebase.service';
import { MessageService } from '../firebase.service/message.service';
import { ChannelTypeEnum } from '../shared/enums/channel-type.enum';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private userService: UserService,
    private channelService: ChannelFirebaseService,
    private messageService: MessageService
  ) {}


  applyFilters(searchTerm: string): {
    users: User[];
    channels: Channel[];
    messages: Message[];
  } {
    return {
      users: this.filterUsers(searchTerm, this.userService.allUsers),
      channels: this.filterChannels(searchTerm, this.channelService.channels),
      messages: this.filterMessages(searchTerm, this.messageService.messages),
    };
  }


  clearFilters(): { users: User[]; channels: Channel[]; messages: Message[] } {
    return {
      users: [],
      channels: [],
      messages: [],
    };
  }


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


  filterUsersByPrefix(prefix: string, users: User[]): User[] {
    const lowerCaseTerm = this.searchTerm(prefix.slice(1)); // Entferne das @-Zeichen
    // Filtere Benutzer basierend auf dem Suchbegriff und prüfe, ob ein Teil des Benutzernamens mit dem Suchbegriff übereinstimmt
    return users.filter((user) =>
      user.name
        .split(' ')
        .some((part: string) => part.toLowerCase().startsWith(lowerCaseTerm))
    );
  }
  

  filterChannelsByTypeAndPrefix(
    prefix: string,
    channelType: ChannelTypeEnum
  ): Channel[] {
    const lowerCaseTerm = this.searchTerm(prefix.slice(1)); // Entferne das #-Zeichen
    // Filtere Kanäle basierend auf dem Typ und prüfe, ob ein Teil des Kanalnamens mit dem Suchbegriff übereinstimmt
    return this.channelService.channels.filter(
      (channel) =>
        channel.channel_type === channelType &&
        channel.name
          .split(' ')
          .some((part: string) => part.toLowerCase().startsWith(lowerCaseTerm))
    );
  }
}
