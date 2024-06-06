import {
  Component,
  ComponentRef,
  ElementRef,
  Input,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { CursorPositionService } from '../../services/cursor-position.service';

@Component({
  selector: 'app-popup-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './popup-search.component.html',
  styleUrl: './popup-search.component.scss',
})
export class PopupSearchComponent {
  // searchControl = new FormControl();
  // private subscriptions = new Subscription();
  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  selectedUserId: string = '';

  @Input() inputText: string = '';
  // @Input() inputElement!: any ;
  @Input() inputElement!: ElementRef;
  @Input() viewContainerRef!: ViewContainerRef;


  constructor(
    public searchService: SearchService,
    public userService: UserService,
    public threadService: ThreadService,
    public channelService: ChannelFirebaseService,
    private stateService: StateManagementService,
    private router: Router,
    private renderer: Renderer2,
    public cursorPositionService :CursorPositionService,
  ) {}

  ngOnInit() {
    // console.log(this.inputElement)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputText']) {
      this.filter(this.inputText);
      console.log('tagText', this.inputText);
    }
  }

  ngOnDestroy(): void {}

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


  // addTagLinkToText(user : User) {
  //   let innerHTML = this.inputElement.innerHTML;
  //   if(innerHTML) {
  //     let newHTML = innerHTML.replace(this.inputText, `<button #profileBtn class="btn-text-v3" appOpenProfile [userId]="${user.id}" [button]="profileBtn">@${user.name}</button>`);
  //     this.inputElement.innerHTML = newHTML;
  //   }
  // }

  addTagLinkToText(user: User, event : Event) {
    // replace inputText with HMTL Element
    event.preventDefault();
    let container = this.inputElement.nativeElement;
    let range = this.cursorPositionService.restoreCursorPosition(container);;
    range = this.extendRangeBeforeCursor(range!, this.inputText);
    
      // Ersetzen Sie den Range durch neuen Text
    this.replaceRangeWithHTML(range, `<span class="dynamic-user" data-userid="${user.id}">${user.name}</span>`);
    
    // Replace placeholders with dynamic components
    const dynamicUserElements = container.querySelectorAll('.dynamic-user');
    dynamicUserElements.forEach((element: HTMLElement) => {
      const userId = element.getAttribute('data-userid');
      const userName = element.innerText;

      const componentRef: ComponentRef<ProfileButtonComponent> =
        this.viewContainerRef.createComponent(ProfileButtonComponent);
      componentRef.instance.userId = userId!;
      componentRef.instance.userName = userName;

      this.renderer.insertBefore(
        container,
        componentRef.location.nativeElement,
        element
      );
      this.renderer.removeChild(container, element);
      this.inputText = '';
    });
  }

  extendRangeBeforeCursor(range: Range, inputText: string) {
    // Hole den Startpunkt der Range
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    // Berechne die neue Startposition, indem du die Länge des Eingabetextes abziehst
    const newStartOffset = startOffset - inputText.length;
    // Setze den neuen Startpunkt der Range
    range.setStart(startContainer, newStartOffset);
    // Setze den Endpunkt der Range auf den ursprünglichen Startpunkt
    range.setEnd(startContainer, startOffset);
    return range;
  }

  replaceRangeWithHTML(range: Range, newHTML: string) {
    let string = range.toString();
    range.deleteContents();
    const container = range.startContainer.parentElement;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newHTML;
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    range.insertNode(fragment);
  }


  // replaceRangeWithText(range: Range, newText: string) {
  //   // Lösche den aktuellen Inhalt der Range
  //   range.deleteContents();
  //   // Erstelle ein Textknoten mit dem neuen Text
  //   const textNode = document.createTextNode(newText);
  //   // Füge den Textknoten in die Range ein
  //   range.insertNode(textNode);
  // }


  // TODO: maybe export into service
  // getSelectionPosition(element: HTMLElement): number {
  //   const selection = window.getSelection();
  //   if (!selection || selection.rangeCount === 0) {
  //     return 0;
  //   }
  //   const range = selection.getRangeAt(0);
  //   const preCaretRange = range.cloneRange();
  //   let preCaretRangeSTring = preCaretRange.toString();
  //   preCaretRange.selectNodeContents(element);
  //   preCaretRangeSTring = preCaretRange.toString();
  //   preCaretRange.setEnd(range.startContainer, range.startOffset);
  //   preCaretRangeSTring = preCaretRange.toString();
  //   let preCaretText = preCaretRange.toString();
  //   // preCaretText = preCaretText.replace(/<div>|<\/div>|<br>/g, '');
  //   const startOffset = preCaretText.length;
  //   return startOffset;
  // }

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
