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
import { ChannelTypeEnum } from '../../../shared/enums/channel-type.enum';
import { SearchService } from '../../../services/search.service';
import { OpenProfileDirective } from '../../../shared/directives/open-profile.directive';
import { Router, RouterModule } from '@angular/router';
import { ThreadService } from '../../../services/thread.service';
import { UtilityService } from '../../../services/utility.service';
// import { SearchResultsComponent } from '../../../shared/search-results/search-results.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    OpenProfileDirective,
    RouterModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  filteredMessages: Message[] = [];
  searchControl = new FormControl();
  private subscriptions = new Subscription();

  newDirectChannel: Channel = {
    id: '',
    name: 'Direct Channel',
    description: '',
    created_at: new Date().getTime(),
    creator: '',
    members: [],
    active_members: [],
    channel_type: ChannelTypeEnum.direct,
  };

  constructor(
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public messageService: MessageService,
    public searchService: SearchService,
    public router: Router,
    public threadService: ThreadService,
    public utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(300))
        .subscribe((value) => {
          this.filter(value);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  filter(searchTerm: string): void {
    if (searchTerm.startsWith('@')) {
      this.filteredUsers = this.searchService.filterUsersByPrefix(
        searchTerm,
        this.userService.allUsers
      );
      this.filteredChannels = [];
      this.filteredMessages = [];
    } else if (searchTerm.startsWith('#')) {
      this.filteredChannels = this.searchService.filterChannelsByTypeAndPrefix(
        searchTerm,
        ChannelTypeEnum.main
      );
      this.filteredUsers = [];
      this.filteredMessages = [];
    } else if (searchTerm.length > 0) {
      const results = this.searchService.applyFilters(searchTerm);
      this.filteredUsers = results.users;
      this.filteredChannels = results.channels;
      this.filteredMessages = results.messages;
    } else {
      const results = this.searchService.clearFilters();
      this.filteredUsers = results.users;
      this.filteredChannels = results.channels;
      this.filteredMessages = results.messages;
    }
  }

  displayChannelTime(): string {
    return this.utilityService.getChannelCreationTime();
  }

  closeThread() {
    this.userService.saveLastThread(this.userService.currentUser.id, '');
    this.threadService.closeThread();
  }
}
