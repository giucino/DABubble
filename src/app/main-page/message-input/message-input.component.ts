import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { UserService } from '../../firebase.service/user.service';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { MessageService } from '../../firebase.service/message.service';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { DialogEmojiPickerComponent } from '../channel/dialog-emoji-picker/dialog-emoji-picker.component';
import { PopupSearchComponent } from '../../shared/popup-search/popup-search.component';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule, PopupSearchComponent],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  @Input() usedIn: 'channel' | 'thread' = 'channel';
  // @ViewChild('channelInput') channelInput! :ElementRef<HTMLDivElement>

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

  tagText: string = '';

  constructor(
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    public messageService: MessageService,
    public customDialogService: CustomDialogService,
    private renderer: Renderer2,
  ) {
  }

  // ngAfterViewInit() {
  //   this.channelInput.nativeElement.focus();
  // }

  async saveMessage(channelInput: HTMLDivElement, fileInput: HTMLInputElement) {
    if (this.messageInput != '' || this.currentFile != null) {
      // create new message and receive message id
      this.message.user_id = this.currentUser.id;
      this.message.message.text = this.formatMessageForSave(channelInput.innerHTML);
      this.message.created_at = new Date().getTime();
      this.message.modified_at = this.message.created_at;
      if (this.usedIn == 'channel')
        this.message.channel_id = this.channelService.currentChannel.id;
      if (this.usedIn == 'thread')
        this.message.thread_id = this.channelService.currentThread.id;
      this.message.id = await this.messageService.addMessage(this.message);
      // thread message update
      if (this.usedIn == 'thread') this.updateThreadMessage();
      // upload currentFile
      if (this.currentFile != null) {
        const path =
          'users/' +
          this.currentUser.id +
          '/messages/' +
          this.message.id +
          '/' +
          this.currentFile.name;
        await this.messageService.uploadFile(this.currentFile, path);
        this.message.message.attachements = [];
        this.message.message.attachements.push(path);
        this.messageService.updateMessage(this.message);
        this.removeFile(fileInput);
      }
      // empty input
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
    let contact = this.channelService.currentChannel.members.find(
      (member) => member != this.currentUser.id
    );
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
      if (file.size > 500 * 1024) {
        //500KB
        this.currentFile = null;
        this.errorMessage = 'Die Datei ist zu groß. Max. 500KB.';
        setTimeout(() => (this.errorMessage = ''), 5000);
      }

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.currentFile = null;
        this.errorMessage =
          'Ungültiger Dateityp. Bitte wählen Sie eine Bild- oder PDF-Datei.';
        setTimeout(() => (this.errorMessage = ''), 5000);
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.messageInput = this.messageInput + result;
        input.innerHTML = this.messageInput;
      }
    });
  }

  //#region @/# Tag System
  checkForTag(event: Event, element: HTMLElement) {
    const text = element.innerText;
    const cursorPosition = this.getSelectionPosition();
    const textBeforeCursor = text.slice(0, cursorPosition);
    const charBeforeCursor = textBeforeCursor[cursorPosition - 1];
    this.tagText = '';
    if (charBeforeCursor && !/\s/.test(charBeforeCursor)) {
      const atIndex = textBeforeCursor.lastIndexOf('@');
      if (atIndex !== -1) {
        const charBeforeAt = textBeforeCursor[atIndex - 1];
        if (!charBeforeAt || charBeforeAt.match(/\s/)) {
          this.tagText = textBeforeCursor.slice(atIndex);
        }
      }
    }
  }

  getSelectionPosition(): number {
    const selection = window.getSelection();
    if (selection) {
      return selection.getRangeAt(0).startOffset;
    }
    return 0;
  }

  handleKeyDown(event: KeyboardEvent, element : HTMLElement) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      
      // Prüfen ob die Backspace- oder Delete-Taste gedrückt wurde
      if (event.key === 'Backspace' || event.key === 'Delete') {
        // Finden Sie das nächste Element
        let elementToRemove = null;
        
        if (container.nodeType === Node.ELEMENT_NODE) {
          elementToRemove = container as HTMLElement;
        } else if (container.nodeType === Node.TEXT_NODE) {
          elementToRemove = container.parentElement;
        }
        
        if (elementToRemove && elementToRemove.classList.contains('tag')) {
          event.preventDefault();
          this.renderer.removeChild(element, elementToRemove);
          console.log('Tag-Element entfernt:', elementToRemove);
        }
      }
    }
  }

  //#endregion

  //#region Utility XSS Prevention



  escapeHTML(text : string) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  formatTagForSave(text : string) {
    // const formattedText = text.replace(/<div class="tag" data-id="([^"]+)" contenteditable="false" style="display: inline-block; background-color: aqua;">@[^<]+<\/div>/g, '@$1');
    const formattedText = text.replace(/`<button #profileBtn class="btn-text-v3" appOpenProfile [userId]="([^"]+)" [button]="profileBtn">@[^<]+<\/button>`/g, '@$1');
    console.log(formattedText);
    return formattedText;
  }

  formatMessageForSave(text : string) {
    let formattedText = this.formatTagForSave(text);
    return this.escapeHTML(formattedText);
    // return message.message.text.replace(/<span class="tag" data-id="(\d+)">@\w+<\/span>/g, '@$1');
  }

  formatTagForRead(text:  string) {
    let formattedText = text.replace(/@([a-zA-Z0-9]+)/g, (match, userId) => {
      const user = this.userService.allUsers.find((user) => user.id == userId);
      if (user) {
        // return `<div class="tag" data-id="${user.id}" contenteditable="false" style="display: inline-block; background-color: aqua;">@${user.name}</div>`;
        return `<button #profileBtn class="btn-text-v3" appOpenProfile [userId]="${user.id}" [button]="profileBtn">@${user.name}</button>`;
      }
      return match;
    });
    return formattedText;
  }

  formatMessageForRead(text : string) {
   let formattedText = this.escapeHTML(text);
   formattedText = this.formatTagForRead(formattedText);
  }


  //#endregion
}
