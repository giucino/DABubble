import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Message } from '../../../../interfaces/message.interface';
import { CursorPositionService } from '../../../../services/cursor-position.service';
import { PopupSearchComponent } from '../../../../shared/popup-search/popup-search.component';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { OpenProfileDirective } from '../../../../shared/directives/open-profile.directive';
import { DialogEmojiPickerComponent } from '../../dialog-emoji-picker/dialog-emoji-picker.component';
import { CustomDialogService } from '../../../../services/custom-dialog.service';
import { MessageService } from '../../../../firebase.service/message.service';

@Component({
  selector: 'app-edit-message',
  standalone: true,
  imports: [
    CommonModule,
    PopupSearchComponent,
    SafeHtmlPipe,
    OpenProfileDirective,
  ],
  templateUrl: './edit-message.component.html',
  styleUrl: './edit-message.component.scss',
})
export class EditMessageComponent {
  @Input() channelType: 'main' | 'direct' | 'thread' | 'new' = 'main';
  @Input() message: Message = {
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
    last_reply: 0,
  };

  editableMessage = JSON.parse(JSON.stringify(this.message));

  @Output() closeEditEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('channelInput', { static: true }) channelInput!: ElementRef;
  @ViewChild('channelInput', { read: ViewContainerRef, static: true })
  channelInputViewRef!: ViewContainerRef;
  tagText: string = '';

  constructor(
    public messageService: MessageService,
    // public userService: UserService,
    // public channelService: ChannelFirebaseService,
    // public threadService: ThreadService,
    public customDialogService: CustomDialogService,
    // public reactionService: ReactionService,
    // public sharedService: SharedService,
    // public mainpage : MainPageComponent, // TODO: als Service
    private renderer: Renderer2,
    public cursorPositionService: CursorPositionService
  ) {}

  ngOnInit() {
    this.editableMessage = JSON.parse(JSON.stringify(this.message));
  }

  get channelInputElement(): ElementRef {
    return this.channelInput;
  }

  //#region update message
  updateMessage(channelInput: HTMLDivElement) {
    this.editableMessage.modified_at = new Date().getTime();
    this.editableMessage.message.text = this.formatMessageForSave(channelInput.innerHTML);
    this.messageService.updateMessage(this.editableMessage);
    this.closeEdit();
  }

  closeEdit() {
    this.closeEditEvent.emit();
  }

  formatTagForSave(text : string) {
    const regex = new RegExp(/<app-profile-button[^>]*><button[^>]*ng-reflect-user-id="([^"]+)"[^>]*>[^<]*<\/button><\/app-profile-button>/g)
    const formattedText = text.replace(regex, '@$1');
    return formattedText;
  }

  formatMessageForSave(text : string) {
    let formattedText = this.formatTagForSave(text);
    return this.escapeHTML(formattedText);
  }

  escapeHTML(text : string) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  //#endregion

  //#region emoji picker
  openDialogEmojiPicker(input: HTMLDivElement) {
    const component = DialogEmojiPickerComponent;
    const dialogRef = this.customDialogService.openDialog(component);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editableMessage.message.text += result;
        input.innerHTML = this.editableMessage.message.text;
      }
    });
  }
  //#endregion emoji picker

  //#region  @/# Tag System
  checkForTag(element: HTMLElement) {
    const text = element.innerText;
    const cursorPosition = this.getSelectionPosition(element);
    const textBeforeCursor = text.slice(0, cursorPosition);
    const charBeforeCursor = textBeforeCursor[cursorPosition - 1];
    this.tagText = '';
    if (charBeforeCursor && !/\s/.test(charBeforeCursor)) {
      const atIndex = textBeforeCursor.lastIndexOf('@');
      if (atIndex !== -1) {
        const charBeforeAt = textBeforeCursor[atIndex - 1];
        const charAfterAt = textBeforeCursor[atIndex + 1];
        if (
          (!charBeforeAt || charBeforeAt.match(/\s/)) &&
          !charAfterAt?.match(/\s/)
        ) {
          this.tagText = textBeforeCursor.slice(atIndex);
        }
      }
    }
  }

  getSelectionPosition(element: HTMLElement): number {
    const selection = window.getSelection();
    this.cursorPositionService.setLastCursorPosition(element);
    if (!selection || selection.rangeCount === 0) {
      return 0;
    }

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    let preCaretText = preCaretRange.toString();

    const startOffset = preCaretText.length;
    return startOffset;
  }

  handleKeyDown(event: KeyboardEvent, element: HTMLElement) {
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
}
