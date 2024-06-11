import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Channel } from '../../../interfaces/channel.interface';
import { User } from '../../../interfaces/user.interface';
import { SearchService } from '../../../services/search.service';
import { ChannelTypeEnum } from '../../../shared/enums/channel-type.enum';
import { UserService } from '../../../firebase.service/user.service';
import { CommonModule } from '@angular/common';
import { NewMessageAdresseesService } from '../../../services/new-message-adressees.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';

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
  @Output() clearSearchEvent = new EventEmitter();

  constructor(
    public searchService: SearchService,
    public userService: UserService,
    public newMessagAddressees : NewMessageAdresseesService,
    // public threadService: ThreadService,
    public channelService: ChannelFirebaseService,
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


  async addDirectChannelToArray(userId : string) {
    let channelId = this.channelService.getDirectChannelId(this.userService.currentUser.id, userId);
    if(!channelId) channelId = await this.channelService.createDirectChannel(this.userService.currentUser.id, userId);
    if(channelId) this.addChannelToArray(channelId);
  }
  
  addChannelToArray(channelId: string) {
    this.newMessagAddressees.add(channelId);
    this.clearSearch();
  }

  clearSearch() {
    this.clearSearchEvent.emit();
  }


}
