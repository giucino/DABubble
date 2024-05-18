import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { LogOutDialogComponent } from './log-out-dialog/log-out-dialog.component';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { UserService } from '../../firebase.service/user.service';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { ChannelFirebaseService } from '../../firebase.service/channelFirebase.service';
import { SharedService } from '../../firebase.service/shared.service';
@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MatCardModule, MainMenuComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
})
export class MainHeaderComponent {
  anonymImg = 'assets/img/person.png';
  serverName: any = 'Dabbuble';
  
  constructor( private customDialogService: CustomDialogService,
    public userService: UserService, public channelService: ChannelFirebaseService,
    private renderer: Renderer2, private el: ElementRef,
    public sharedService: SharedService) {
  }

  ngAfterViewInit() {
    this.sharedService.showMobileDiv$.subscribe(() => {
      const mobileDiv = this.el.nativeElement.querySelector('.mobile');
      this.renderer.addClass(mobileDiv, 'show');
    });
    this.sharedService.backToChannels$.subscribe(() => {
      const mobileDiv = this.el.nativeElement.querySelector('.mobile');
      this.renderer.removeClass(mobileDiv, 'show');
    });
  }

  ngOnInit() {
  }

  backToChannels() {
    this.sharedService.backToChannels();
  }


  openLogOutDialog(button: HTMLElement) {
    const component = LogOutDialogComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');
  }

}
