import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { UserService } from '../../firebase.service/user.service';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { MessageService } from '../../firebase.service/message.service';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { DialogEmojiPickerComponent } from '../channel/dialog-emoji-picker/dialog-emoji-picker.component';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  @ViewChild('channelInput') channelInput!: ElementRef;
  @Input() usedIn: 'channel' | 'thread' = 'channel';

  messageInput: string = '';
  currentUser: User = this.userService.currentUser;

  message: Message = {
    user_id: '',
    channel_id: '',
    message: {
      text: '',
      attachements: [],
    },
    created_at: 0,
    modified_at: 0,
    is_deleted: false,
    last_reply: 0,
  };

  // currentFiles : any[] = [];
  currentFile: any | null = null;
  errorMessage: string = '';

  constructor(
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public messageService: MessageService,
    public customDialogService: CustomDialogService,
  ) {

  }

  async saveMessage(channelInput: HTMLDivElement, fileInput: HTMLInputElement) {
    const trimmedMessageInput = this.messageInput.trim();
    if (trimmedMessageInput != '' || this.currentFile != null) {
      this.message.user_id = this.currentUser.id;
      this.message.message.text = trimmedMessageInput;
      this.message.created_at = new Date().getTime();
      this.message.modified_at = this.message.created_at;
      if (this.usedIn == 'channel') this.message.channel_id = this.channelService.currentChannel.id;
      if (this.usedIn == 'thread') this.message.thread_id = this.channelService.currentThread.id;
      this.message.id = await this.messageService.addMessage(this.message);
      if (this.usedIn == 'thread') this.updateThreadMessage();
      if (this.currentFile != null) {
        const path = 'users/' + this.currentUser.id + '/messages/' + this.message.id + '/' + this.currentFile.name;
        await this.messageService.uploadFile(this.currentFile, path);
        this.message.message.attachements = [];
        this.message.message.attachements.push(path);
        this.messageService.updateMessage(this.message);
        this.removeFile(fileInput);
      }
      this.messageInput = '';
      channelInput.innerText = '';
    }
  }

  updateThreadMessage() {
    let threadMessages = this.messageService.messagesThread;
    let threadMessage = this.messageService.messagesThread[0];
    threadMessage.total_replies = threadMessages.length - 1;
    threadMessage.last_reply = this.message.created_at;
    this.messageService.updateMessage(threadMessage);
  }


  getDirectChannelUser() {
    let contact = this.channelService.currentChannel.members.find((member) => member != this.currentUser.id);
    if (contact) return this.userService.getUser(contact);
    else return this.currentUser;
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

  addDocument(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.currentFile = file;
      this.currentFile.URL = this.createURL(file);
      if (file.size > 500 * 1024) { //500KB
        this.currentFile = null;
        this.errorMessage = 'Die Datei ist zu groß. Max. 500KB.';
        setTimeout(() => this.errorMessage = '', 5000);
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.currentFile = null;
        this.errorMessage = 'Ungültiger Dateityp. Bitte wählen Sie eine Bild- oder PDF-Datei.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    }
  }

  createURL(file: File) {
    return URL.createObjectURL(file);
  }

  removeFile(input: HTMLInputElement) {
    this.currentFile = null;
    input.value = '';
  }


  /* Dialog Emoji Picker */
  openDialogEmojiPicker(input: HTMLDivElement) {
    const component = DialogEmojiPickerComponent;
    const dialogRef = this.customDialogService.openDialog(component);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageInput = this.messageInput + result;
        input.innerText = this.messageInput;
      }
    })
  }

 

  async setFocusOnInput() {
    await this.channelInput.nativeElement.focus();
  }

}
