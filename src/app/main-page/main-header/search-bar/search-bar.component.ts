import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { User } from '../../../interfaces/user.interface';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { Channel } from '../../../interfaces/channel.interface';
import { MessageService } from '../../../firebase.service/message.service';
import { Message } from '../../../interfaces/message.interface';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  searchInput: string = '';
  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  filteredMessages: Message[] = [];

  constructor(
    private userService: UserService,
    private channelService: ChannelFirebaseService,
    private messageService: MessageService
  ) {}

  filter(): void {
    this.filterUsers();
    this.filterChannels();
    this.filterMessages();
  }

  filterUsers(): void {
    const searchTerm = this.searchInput ? this.searchInput.trim().toLowerCase() : '';
    this.filteredUsers = this.userService.allUsers.filter((user) =>
      user.name.split(' ').some((part: string) => part.toLowerCase().startsWith(searchTerm))
    );
  }
  
  filterChannels(): void {
    const searchTerm = this.searchInput ? this.searchInput.trim().toLowerCase() : '';
    this.filteredChannels = this.channelService.channels.filter((channel) =>
      channel.name.split(' ').some(part => part.toLowerCase().startsWith(searchTerm))
    );
  }
  
  filterMessages(): void {
    const searchTerm = this.searchInput ? this.searchInput.trim().toLowerCase() : '';
    this.filteredMessages = this.messageService.messages.filter((message) =>
      message.message.text.split(' ').some(part => part.toLowerCase().startsWith(searchTerm))
    );
  }
}