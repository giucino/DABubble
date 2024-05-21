import { Component } from '@angular/core';
import { MessageService } from '../../firebase.service/message.service';
import { UserService } from '../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { MessageComponent } from '../channel/message/message.component';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { ThreadService } from '../../services/thread.service';
import { MessageInputComponent } from '../message-input/message-input.component';
import { HostListener } from '@angular/core';
import { doc } from '@angular/fire/firestore';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MessageComponent, FormsModule, MessageInputComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
})
export class ThreadComponent {

  currentUser: User = this.userService.currentUser;
  currentDate: string = '1970/01/01';

  messageInput: string = '';
  message: Message = {
    user_id: '',
    channel_id: '',
    thread_id: this.channelService.currentThread.id,
    message: {
      text: '',
      attachements: [],
    },
    created_at: 0,
    modified_at: 0,
    is_deleted: false,
    last_reply: 0,
  };

  currenThread;


  constructor(
    public messageService: MessageService,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public threadService: ThreadService,
    public sharedService: SharedService,
  ) {
    this.currenThread = this.userService.subCurrentUserForThread(this.userService.currentUser.id);
    this.userService.currentUserThread$.subscribe(thread_id => {
      if (thread_id && thread_id != '') {
        this.channelService.unsubCurrentThread = this.channelService.getCurrentThread(thread_id);
        this.messageService.getMessagesFromThread(thread_id);
        this.setFocus();
      }
    })

  }

  ngOnDestroy() {
    this.channelService.unsubCurrentThread();
    this.messageService.unsubMessagesThread();
    this.currenThread();
  }

  isNewDate(date: number) {
    let currentDate = this.currentDate;
    let messageDate = this.convertToDate(date);
    this.currentDate = messageDate;
    return currentDate != messageDate;
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

  getDirectChannelUser() {
    let contact = this.channelService.currentChannel.members.find((member) => member != this.currentUser.id);
    if (contact) return this.userService.getUser(contact);
    else return this.currentUser;
  }

  closeThread() {
    this.userService.saveLastThread(this.userService.currentUser.id, '');
    this.threadService.closeThread();
  }

  setFocus() {
    document.getElementById('threadInput')?.focus();
    this.messageInput = '';
  }

  // @HostListener('window:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   this.sharedService.isMenuOpen$.subscribe(isMenuOpen => {
  //       let th = document.getElementById('thread');
  //       if (th) {
  //           if (window.innerWidth < 1024 && isMenuOpen) {
  //               th.style.position = 'absolute';
  //               th.style.left = '40px';
  //               th.style.maxWidth = 'calc(100% - 40px)';
  //           } 
  //           else {
  //               // th.style.position = 'relative';
  //               // th.style.left = '0';
  //           }
  //       }
  //   });
  // }
}
