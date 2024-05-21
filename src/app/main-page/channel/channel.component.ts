import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageComponent } from './message/message.component';
import { DialogAddMemberComponent } from './dialog-add-member/dialog-add-member.component';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { DialogShowMembersComponent } from './dialog-show-members/dialog-show-members.component';
import { DialogEditChannelComponent } from './dialog-edit-channel/dialog-edit-channel.component';
import { MessageService } from '../../firebase.service/message.service';
import { Message } from '../../interfaces/message.interface';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ThreadService } from '../../services/thread.service';
import { MessageInputComponent } from '../message-input/message-input.component';
import { finalize } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { ChannelTypeEnum } from '../../shared/enums/channel-type.enum';
import { Channel } from '../../interfaces/channel.interface';
import { SearchService } from '../../services/search.service';
import { OpenProfileDirective } from '../../shared/directives/open-profile.directive';


@Component({
  selector: 'app-channel',
  standalone: true,

  imports: [
    CommonModule,
    MessageComponent,
    FormsModule,
    MessageInputComponent,
    ReactiveFormsModule,
    OpenProfileDirective,
    RouterModule,
  ],

  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  messageInput: string = '';
  currentUser: User = this.userService.currentUser;

  // alle user die im channel sind
  channelMembers = this.channelService.currentChannel.members;
  users: User[] = this.userService.allUsers.filter((user) =>
    this.channelMembers.includes(user.id)
  );

  message: Message = {
    user_id: '',
    channel_id: this.channelService.currentChannel.id,
    message: {
      text: '',
      attachements: [],
    },
    created_at: 0,
    modified_at: 0,
    is_deleted: false,
    last_reply: 0,
  };

  channelId: string = '';
  isLoading = false;
  searchControl = new FormControl();
  private subscriptions = new Subscription();
  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];

  constructor(
    public customDialogService: CustomDialogService,
    public messageService: MessageService,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public threadService: ThreadService,
    public searchService: SearchService
  ) {
    this.channelId =
      this.activatedRoute.snapshot.paramMap.get('channelId') || ''; //get url param
    this.userService.getCurrentUser();
    this.router.navigateByUrl(
      '/main-page/' + this.userService.currentUser.last_channel
    ); // open last channel
  }

  ngOnInit() {
    this.openChannel();
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

  filter(searchTerm: string): void {
    if (searchTerm.startsWith('@')) {
      this.filteredUsers = this.userService.allUsers;
      this.filteredChannels = [];
    } else if (searchTerm.startsWith('#')) {
      this.filteredChannels = this.channelService.channels.filter(
        (channel) => channel.channel_type === ChannelTypeEnum.main
      );
      this.filteredUsers = [];
    } else if (searchTerm.length > 0) {
      const results = this.searchService.applyFilters(searchTerm);
      this.filteredUsers = results.users;
      this.filteredChannels = results.channels;
    } else {
      const results = this.searchService.clearFilters();
      this.filteredUsers = results.users;
      this.filteredChannels = results.channels;
    }
  }

  openChannel() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['channelId']) {
        this.isLoading = true;
        this.setFocus();
        const loadChannel = this.channelService.getCurrentChannel(
          params['channelId']
        );
        const loadMessages = this.messageService.getMessagesFromChannel(
          params['channelId']
        );
        const updateUser = this.userService.updateLastChannel(
          this.userService.currentUser.id,
          params['channelId']
        ); // save last channel
        // alle 3 promises müssen geladen werden + halbe.sekunde bis der loadingspinner weggeht
        Promise.all([loadChannel, loadMessages, updateUser])
          .then(() => {
            // setTimeout(() => {
            this.isLoading = false;
            // }, 500);
          })
          .catch(() => {
            // setTimeout(() => {
            this.isLoading = false;
            // }, 500);
          });
      }
    });
  }

  openAddUserDialog(button: HTMLElement) {
    const component = DialogAddMemberComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
  }

  openShowMembersDialog(button: HTMLElement) {
    const component = DialogShowMembersComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
  }

  openEditChannelDialog(button: HTMLElement) {
    const component = DialogEditChannelComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'left');
  }

  // saveMessage() {
  //   if (this.messageInput != '') {
  //     this.message.user_id = this.currentUser.id;
  //     this.message.message.text = this.messageInput;
  //     this.message.created_at = new Date().getTime();
  //     this.message.modified_at = this.message.created_at;
  //     this.message.channel_id = this.channelService.currentChannel.id;
  //     this.messageService.addMessage(this.message);
  //     this.messageInput = '';
  //   }
  // }

  isNewDate(oldDate: number, newDate: number) {
    let oldDateAsString = this.convertToDate(oldDate);
    let newDateAsString = this.convertToDate(newDate);
    return oldDateAsString != newDateAsString;
  }

  getDateFormat(dateInput: number) {
    const weekdays = [
      'Sonntag',
      'Montag',
      'Dienstag',
      'Mittwoch',
      'Donnerstag',
      'Freitag',
      'Samstag',
    ];
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    let d = new Date(dateInput);
    let date = d.getDate();
    let day: number | string = d.getDay();
    let month: number | string = d.getMonth() + 1;
    day = weekdays[day];
    month = months[month];
    let result = day + ',' + ' ' + date + ' ' + month;
    return result;
  }

  convertToDate(dateAsNumber: number) {
    let date = new Date(dateAsNumber);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth() + 1;
    let y: number | string = date.getFullYear();
    if (d < 10) d = '0' + d;
    if (m < 10) m = '0' + m;
    let result = y + '/' + m + '/' + d;
    return result;
  }

  // TODO: move to userService
  // getUser(user_id : string) {
  //   return this.users.find((user) => user.id == user_id);
  // }

  getDirectChannelUser() {
    let contact = this.channelService.currentChannel.members.find(
      (member) => member != this.currentUser.id
    );
    if (contact) return this.userService.getUser(contact);
    else return this.currentUser;
  }

  getChannelCreationTime() {
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    let date = new Date(this.channelService.currentChannel.created_at);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth();
    let y = date.getFullYear();
    if (
      this.convertToDate(new Date().getTime()) ==
      this.convertToDate(this.channelService.currentChannel.created_at)
    ) {
      return 'heute';
    } else {
      return 'am' + ' ' + d + '. ' + months[m] + ' ' + y;
    }
  }


  getTextareaPlaceholderText() {
    switch (this.channelService.currentChannel.channel_type) {
      case 'main':
        return 'Nachricht an ' + '#' + this.channelService.currentChannel.name;
        break;
      case 'direct':
        if (this.channelService.currentChannel.members.length == 2) {
          return 'Nachricht an ' + this.getDirectChannelUser()?.name;
        } else {
          return 'Nachricht an ' + 'dich';
        }
        break;
      case 'thread':
        return 'Antworten...';
        break;
      case 'new':
        return 'Starte eine neue Nachricht';
        break;
      default:
        return 'Starte eine neue Nachricht';
    }
  }


  setFocus() {
    document.getElementById('channelInput')?.focus();
    this.messageInput = '';
  }


  updateInput(newContent : string) {
    this.messageInput = newContent;
  }


  closeThread() {
    this.userService.saveLastThread(this.userService.currentUser.id, '');
    this.threadService.closeThread();
  }

}
