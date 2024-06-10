import { Component, Input, SimpleChanges } from '@angular/core';
import { Channel } from '../../../interfaces/channel.interface';
import { User } from '../../../interfaces/user.interface';
import { SearchService } from '../../../services/search.service';
import { ChannelTypeEnum } from '../../../shared/enums/channel-type.enum';
import { UserService } from '../../../firebase.service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-new-message-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-new-message-search.component.html',
  styleUrl: './popup-new-message-search.component.scss'
})
export class PopupNewMessageSearchComponent {

  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  selectedUserId: string = '';

  @Input() searchTerm: string = '';
  
  constructor(
    public searchService: SearchService,
    public userService: UserService,
    // public threadService: ThreadService,
    // public channelService: ChannelFirebaseService,
    // private renderer: Renderer2,
    // public cursorPositionService :CursorPositionService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchTerm']) this.filter(this.searchTerm);
  }



  filter(searchTerm: string): void {
    if (searchTerm.startsWith('@')) {
      this.filteredUsers = this.searchService.filterUsersByPrefix(searchTerm, this.userService.allUsers);
      this.filteredChannels = [];
    } else if (searchTerm.startsWith('#')) {
      this.filteredChannels = this.searchService.filterChannelsByTypeAndPrefix(searchTerm, ChannelTypeEnum.main);
      this.filteredUsers = [];
    } else {
      const results = this.searchService.clearFilters();
      this.filteredUsers = results.users;
      this.filteredChannels = results.channels;
    }
  }


  addDirectChannelToArray(userId : string) {

  }
  
  addChannelToArray(channelId: string) {

  }
}
