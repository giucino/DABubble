import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { UserService } from '../firebase.service/user.service';
import { ChannelFirebaseService } from '../firebase.service/channelFirebase.service';
import { MessageService } from '../firebase.service/message.service';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(
    private userService: UserService,
    private channelService: ChannelFirebaseService,
    private messageService: MessageService,
  ) {}


  filterUsers(searchInput: string, selectedUsers: User[]): User[] {
    const searchTerm = searchInput ? searchInput.trim().toLowerCase() : '';
    return this.userService.allUsers.filter((user) => {
      const isPartOfNameMatched = user.name
        .split(' ')
        .some((part: string) => part.toLowerCase().startsWith(searchTerm));
      const isNotSelected = !selectedUsers.some(selected => selected.id === user.id);
      const isNotCreator = this.channelService.currentChannel.creator !== user.id;
      return isPartOfNameMatched && isNotSelected && isNotCreator;
    });
  }
  

  selectUser(selectedUsers: User[], user: User): User[] {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      selectedUsers.push(user);
    }
    return selectedUsers;
  }


  removeSelectedUser(selectedUsers: User[], user: User): User[] {
    return selectedUsers.filter((u) => u.id !== user.id);
  }


  getCurrentChannelId(): string | undefined {
    return this.channelService.currentChannel.id;
  }


  updateMembers(channelId: string, memberIds: string[]): Promise<void> {
    this.updateMembersForThreadsOfChannel(channelId, memberIds);
    return this.channelService.updateChannelMembers(channelId, memberIds);
  }


  getMemberIds(selectedUsers: User[]): string[] {
    return selectedUsers.map(user => user.id).filter((id): id is string => id !== undefined);
  }


  getAllUserIds(): string[] {
    return this.userService.allUsers.map(user => user.id).filter((id): id is string => id !== undefined);
  }


  updateMembersForThreadsOfChannel(channelId : string, memberIds : string[]) {
    let firstThreadMessages = this.messageService.allMessages.filter((message) => (message.channel_id == channelId && (message.thread_id && message.thread_id != '')));
    firstThreadMessages.forEach((message : Message) => {
      if (message.thread_id && message.thread_id != '') this.channelService.updateChannelMembers(message.thread_id, memberIds);
    })
  }
}
