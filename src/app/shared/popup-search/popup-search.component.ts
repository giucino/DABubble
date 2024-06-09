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

  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  selectedUserId: string = '';

  @Input() inputText: string = '';
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
    if (changes['inputText']) this.filter(this.inputText);
  }

  ngOnDestroy(): void {}

  filter(searchTerm: string): void {
    console.log('searchterm', searchTerm)
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

      range!.setStartAfter(element); // set cursor after tag
      this.renderer.insertBefore(container,componentRef.location.nativeElement,element);
      this.renderer.removeChild(container, element);
      
      this.inputText = '';
    });
  }

  // extendRangeBeforeCursor(range: Range, inputText: string) {
  //   // Hole den Startpunkt der Range
  //   const startContainer = range.startContainer;
  //   const startOffset = range.startOffset;
  //   // Berechne die neue Startposition, indem du die Länge des Eingabetextes abziehst
  //   const newStartOffset = startOffset - inputText.length;
  //   // Setze den neuen Startpunkt der Range
  //   range.setStart(startContainer, newStartOffset);
  //   // Setze den Endpunkt der Range auf den ursprünglichen Startpunkt
  //   range.setEnd(startContainer, startOffset);
  //   return range;
  // }

  extendRangeBeforeCursor(range: Range, inputText: string) {
    // Hole den Startpunkt der Range
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    const inputLength = inputText.length;
  
    let currentNode = startContainer;
    let newStartOffset = startOffset;
  
    while (newStartOffset < inputLength && currentNode.previousSibling) {
      currentNode = currentNode.previousSibling;
      if (currentNode.nodeType === Node.TEXT_NODE) {
        newStartOffset += currentNode.textContent!.length;
      } else if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.nodeName === 'BR') {
        newStartOffset++;
      }
    }
  
    range.setStart(currentNode, Math.max(0, startOffset - inputLength));
    range.setEnd(currentNode, startOffset);
    return range;
  }

  // replaceRangeWithHTML(range: Range, newHTML: string) {
  //   let string = range.toString();
  //   range.deleteContents();
  //   const container = range.startContainer.parentElement;
  //   const tempDiv = document.createElement('div');
  //   tempDiv.innerHTML = newHTML;
  //   const fragment = document.createDocumentFragment();
  //   while (tempDiv.firstChild) {
  //     fragment.appendChild(tempDiv.firstChild);
  //   }
  //   range.insertNode(fragment);
  // }


  replaceRangeWithHTML(range: Range, newHTML: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newHTML;
  
    const fragment = document.createDocumentFragment();
    let child;
    while ((child = tempDiv.firstChild)) {
      fragment.appendChild(child);
    }
  
    // Ensure the range is within a valid element
    const startContainer = range.startContainer;
    if (startContainer.nodeType === Node.TEXT_NODE) {
      range.deleteContents();
      range.insertNode(fragment);
    } else if (startContainer.nodeType === Node.ELEMENT_NODE) {
      const element = startContainer as HTMLElement;
      const offset = range.startOffset;
      const childNodes = element.childNodes;
  
      if (offset < childNodes.length) {
        element.insertBefore(fragment, childNodes[offset]);
      } else {
        element.appendChild(fragment);
      }
    }
  }

}
