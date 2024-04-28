import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message } from '../../../interfaces/message.interface';
import { User } from '../../../interfaces/user.interface';
import { MessageService } from '../../../firebase.service/message.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  showMoreOptions : boolean = false;
  editMessage : boolean = false;
  @Input() channelType : 'main' | 'direct' | 'thread' | 'new' = 'main';
  @Input() message : Message = {
    user_id: '',
    channel_id: '',
    thread_id: '',
    message: {
        text: '',
        reactions: [],
        attachements: [],
    },
    created_at: 0,
    modified_at: 0,
    is_deleted: false,
    total_replies: 0,
  };

  editableMessage : Message = JSON.parse(JSON.stringify(this.message));

  // TODO: replace with userService.currentUser
  currentUser : User = {
    id: 'user_01',
    name: 'Max Mustermann',
    email: 'max@mustermann.de',
    password: 'password',
    logged_in: true,
    is_typing: false,
    profile_img: '/assets/img/avatar-1.jpg',
    // last_channel: string,
  }

  // TODO: replace with userService.users
  users : User[] = [
    {
      id: 'user_01',
      name: 'User 01',
      email: 'user@01.de',
      password: 'password1',
      logged_in: true,
      is_typing: false,
      profile_img: 'avatar-1.jpg',
    },
    {
      id: 'user_02',
      name: 'User 02',
      email: 'user@02.de',
      password: 'password2',
      logged_in: false,
      is_typing: false,
      profile_img: 'avatar-2.jpg',
    },
    {
      id: 'user_03',
      name: 'User 03',
      email: 'user@03.de',
      password: 'password3',
      logged_in: true,
      is_typing: false,
      profile_img: 'avatar-3.jpg',
    },
  ]

  messageCreator : User | undefined = undefined;

  constructor(public messageService : MessageService) {
  }
 
  ngOnInit() {
    this.messageCreator = this.getUser(this.message.user_id);
    this.editableMessage = JSON.parse(JSON.stringify(this.message));
  }

  isCurrentUser() : boolean {
    return this.currentUser.id === this.message.user_id;
  }

  getUser(user_id : string) {
    return this.users.find((user) => user.id == user_id);
  }

  getTime(timeNumber : number) {
    let date = new Date(timeNumber);
    let h = this.addZero(date.getHours());
    let m = this.addZero(date.getMinutes());
    let time = h + ":" + m ;
    return time;
  }

  addZero(i : any) {
    if (i < 10) {i = "0" + i}
    return i;
  }

  updateMessage() {
    // console.log(this.message);
    this.messageService.updateMessage(this.editableMessage);
    this.editMessage = false;
    this.showMoreOptions = false;
  }
  
}
