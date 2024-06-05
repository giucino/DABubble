import { Component, Input, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { Channel } from '../../interfaces/channel.interface';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../firebase.service/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThreadService } from '../../services/thread.service';
import { ChannelTypeEnum } from '../enums/channel-type.enum';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { StateManagementService } from '../../services/state-management.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-popup-search',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './popup-search.component.html',
  styleUrl: './popup-search.component.scss'
})
export class PopupSearchComponent {

  // searchControl = new FormControl();
  // private subscriptions = new Subscription();
  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  selectedUserId: string = '';

  @Input() inputText : string = '';
  @Input() inputElement!: HTMLElement ;

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

  constructor (public searchService: SearchService,
    public userService: UserService,
    public threadService: ThreadService,
    public channelService: ChannelFirebaseService,
    private stateService: StateManagementService,
    private router: Router,
  ) {

  }



  ngOnInit() {
    console.log(this.inputElement)
  }

  ngOnChanges(changes :  SimpleChanges) {
    if (changes['inputText']) {
      this.filter(this.inputText);
    }
  }

  ngOnDestroy(): void {
  }

  filter(searchTerm: string): void {
    if (searchTerm.startsWith('@')) {
      // Suche Benutzer mit dem Präfix '@'
      this.filteredUsers = this.searchService.filterUsersByPrefix(
        searchTerm,
        this.userService.allUsers
      );
      this.filteredChannels = [];
    } else if (searchTerm.startsWith('#')) {
      // Suche Kanäle vom Typ 'main' mit dem Präfix '#'
      this.filteredChannels = this.searchService.filterChannelsByTypeAndPrefix(
        searchTerm,
        ChannelTypeEnum.main
      );
      this.filteredUsers = [];
    } else {
      // Klare Filter, wenn kein Suchbegriff vorhanden ist
      const results = this.searchService.clearFilters();
      this.filteredUsers = results.users;
      this.filteredChannels = results.channels;
    }
  }

  // TODO: eventuell löschen
  clearSearch(): void {
    // this.searchControl.setValue('');
  }

  closeThread() {
    this.userService.saveLastThread(this.userService.currentUser.id, '');
    this.threadService.closeThread();
  }

  addTagLinkToText(user : User) {
    // const cursorPosition = this.getSelectionPosition();
    let innerHTML = this.inputElement.innerHTML;
    if(innerHTML) {
      // let newHTML = innerHTML.replace(this.inputText, `<div class="tag" data-id="${user.id}" contenteditable="false" style="display: inline-block; background-color: aqua;">@${user.name}</div>`);
      let newHTML = innerHTML.replace(this.inputText, `<button #profileBtn class="btn-text-v3" appOpenProfile [userId]="${user.id}" [button]="profileBtn">@${user.name}</button>`);
      
      this.inputElement.innerHTML = newHTML;
      // console.log('InnerHTML:' , newHTML);
      // console.log('innerText', this.inputElement.innerText)
    }
  }

  // TODO: maybe export into service
  getSelectionPosition(): number {
    const selection = window.getSelection();
    if (selection) {
      return selection.getRangeAt(0).startOffset;
    }
    return 0;
  }




  // for the header searchbar
  // async openDirectChannel(user_id: string): Promise<void> {
  //   let channel_id = this.channelService.getDirectChannelId(
  //     this.userService.currentUser.id,
  //     user_id
  //   );
  //   if (channel_id != '') {
  //     this.router.navigateByUrl('/main-page/' + channel_id);
  //   } else {
  //     channel_id = await this.createNewDirectChannel(user_id);
  //     this.router.navigateByUrl('/main-page/' + channel_id);
  //   }
  //   this.closeThread();
  //   this.stateService.setSelectedUserId(user_id);
  // }

  // async createNewDirectChannel(user_id: string) {
  //   this.newDirectChannel.creator = this.userService.currentUser.id;
  //   this.newDirectChannel.created_at = new Date().getTime();
  //   this.newDirectChannel.members = [this.userService.currentUser.id, user_id];
  //   return await this.channelService.addChannel(this.newDirectChannel);
  // }


}


