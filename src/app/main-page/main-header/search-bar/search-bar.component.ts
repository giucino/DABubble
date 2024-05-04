import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../firebase.service/user.service';
import { User } from '../../../interfaces/user.interface';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { Channel } from '../../../interfaces/channel.interface';
import { MessageService } from '../../../firebase.service/message.service';
import { Message } from '../../../interfaces/message.interface';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  filteredMessages: Message[] = [];
  searchControl = new FormControl();
  private subscriptions = new Subscription();

  constructor(
    private userService: UserService,
    private channelService: ChannelFirebaseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300)
        )
        .subscribe(value => {
          this.filter(value);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    console.log('SearchBarComponent destroyed');
  }

  filter(searchTerm: string): void {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
  
    trimmedSearchTerm ? this.applyFilters(trimmedSearchTerm) : this.clearFilters();
  }
  
  applyFilters(trimmedSearchTerm: string): void {
    this.filterUsers(trimmedSearchTerm);
    this.filterChannels(trimmedSearchTerm);
    this.filterMessages(trimmedSearchTerm);
  }
  
  clearFilters(): void {
    this.filteredUsers = [];
    this.filteredChannels = [];
    this.filteredMessages = [];
  }

  filterUsers(searchTerm: string): void {
    this.filteredUsers = this.userService.allUsers.filter(user =>
      user.name.split(' ').some((part: string) => part.toLowerCase().startsWith(searchTerm))
    );
  }
  
  filterChannels(searchTerm: string): void {
    this.filteredChannels = this.channelService.channels.filter(channel =>
      channel.name.split(' ').some((part: string) => part.toLowerCase().startsWith(searchTerm))    );
  }

  filterMessages(searchTerm: string): void {
    this.filteredMessages = this.messageService.messages.filter(message =>
      message.message.text.toLowerCase().includes(searchTerm)
    );
  }

  // filter(): void {
  //   this.filterUsers();
  //   this.filterChannels();
  //   this.filterMessages();
  // }

  // filterUsers(): void {
  //   const searchTerm = this.searchInput ? this.searchInput.trim().toLowerCase() : '';
  //   this.filteredUsers = this.userService.allUsers.filter(user =>
  //     user.name.split(' ').some((part: string) => part.toLowerCase().startsWith(searchTerm))
  //   );
  // }
  
  // filterChannels(): void {
  //   const searchTerm = this.searchInput ? this.searchInput.trim().toLowerCase() : '';
  //   this.filteredChannels = this.channelService.channels.filter(channel =>
  //     channel.name.split(' ').some(part => part.toLowerCase().startsWith(searchTerm))
  //   );
  // }
  
  // filterMessages(): void {
  //   const searchTerm = this.searchInput ? this.searchInput.trim().toLowerCase() : '';
  //   this.filteredMessages = this.messageService.messages.filter(message =>
  //     message.message.text.toLowerCase().includes(searchTerm)
  //   );
  // } 
}