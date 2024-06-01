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
    // this.subscriptions.add(
    //   this.searchControl.valueChanges
    //     .pipe(debounceTime(300))
    //     .subscribe((value) => {
    //       this.filter(value);
    //     })
    // );
  }

  ngOnChanges(changes :  SimpleChanges) {
    if (changes['inputText']) {
      this.filter(this.inputText);
      console.log(this.inputText);
      console.log(this.filteredUsers);
    }
  }

  ngOnDestroy(): void {
    // this.subscriptions.unsubscribe();
  }

  filter(searchTerm: string): void {
    let allMatches = searchTerm.match(/[@#]\w*/g);
    let lastMatch = allMatches ? allMatches[allMatches.length - 1] : '';
    if (lastMatch.startsWith('@')) {
      // Suche Benutzer mit dem Präfix '@'
      this.filteredUsers = this.searchService.filterUsersByPrefix(
        lastMatch,
        this.userService.allUsers
      );
      this.filteredChannels = [];
    } else if (lastMatch.startsWith('#')) {
      // Suche Kanäle vom Typ 'main' mit dem Präfix '#'
      this.filteredChannels = this.searchService.filterChannelsByTypeAndPrefix(
        lastMatch,
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


  // for the header searchbar
  async openDirectChannel(user_id: string): Promise<void> {
    let channel_id = this.channelService.getDirectChannelId(
      this.userService.currentUser.id,
      user_id
    );
    if (channel_id != '') {
      this.router.navigateByUrl('/main-page/' + channel_id);
    } else {
      channel_id = await this.createNewDirectChannel(user_id);
      this.router.navigateByUrl('/main-page/' + channel_id);
    }
    this.closeThread();
    this.stateService.setSelectedUserId(user_id);
  }

  async createNewDirectChannel(user_id: string) {
    this.newDirectChannel.creator = this.userService.currentUser.id;
    this.newDirectChannel.created_at = new Date().getTime();
    this.newDirectChannel.members = [this.userService.currentUser.id, user_id];
    return await this.channelService.addChannel(this.newDirectChannel);
  }


}


