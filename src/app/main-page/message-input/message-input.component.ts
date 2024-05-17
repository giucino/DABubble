import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { UserService } from '../../firebase.service/user.service';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { MessageService } from '../../firebase.service/message.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {

  messageInput  : string = '';
  currentUser: User = this.userService.currentUser;

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

  currentFiles : any[] = [];
  currentFile : any | null = null;

  constructor(
    public userService : UserService,
    public channelService : ChannelFirebaseService,
    public messageService : MessageService,
  ) {

  }

  saveMessage() {
    if (this.messageInput != '') {
      this.message.user_id = this.currentUser.id;
      this.message.message.text = this.messageInput;
      this.message.created_at = new Date().getTime();
      this.message.modified_at = this.message.created_at;
      this.message.channel_id = this.channelService.currentChannel.id;
      this.messageService.addMessage(this.message);
      this.messageInput = '';
    }
  }


  getDirectChannelUser() {
    let contact = this.channelService.currentChannel.members.find((member) => member != this.currentUser.id);
    if (contact) return this.userService.getUser(contact);
    else return this.currentUser;
  }

  getTextareaPlaceholderText() {
    switch(this.channelService.currentChannel.channel_type) {
      case 'main' :
        return 'Nachricht an ' + '#' + this.channelService.currentChannel.name;
        break;
      case 'direct' :
        if (this.channelService.currentChannel.members.length == 2) {
          return 'Nachricht an ' + this.getDirectChannelUser()?.name;
        } else {
          return 'Nachricht an ' + 'dich';
        }
        break;
      case 'thread' : 
        return 'Antworten...';
        break;
      case 'new' : 
        return 'Starte eine neue Nachricht';
        break;
      default :
        return 'Starte eine neue Nachricht';
    }
  }

  addDocument(event : Event) {
    // this.currentFiles = event.target.files;
    // [...this.currentFiles].forEach((file) => {
    //   file.URL = this.createURL(file);
    // })
    // console.log(this.currentFiles);
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length) {
      const file = input.files[0];
      this.currentFile = file;
      this.currentFile.URL = this.createURL(file);
      if(file.size > 500 * 1024) { //500KB
        this.currentFile = null;
        alert('Die Datei ist zu groß. Max. 500KB.');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if(!allowedTypes.includes(file.type)) {
        this.currentFile = null;
        alert('Ungültiger Dateityp. Bitte wählen Sie eine Bild- oder PDF-Datei.');
      }
    }
  }

  createURL(file : File) {
    return URL.createObjectURL(file);
  }

  removeFile() {
    this.currentFile = null;
  }

}
