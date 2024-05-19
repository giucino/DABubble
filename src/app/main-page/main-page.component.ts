import { Component, HostListener } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChannelComponent } from './channel/channel.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { ChannelFirebaseService } from '../firebase.service/channelFirebase.service';
import { UserService } from '../firebase.service/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThreadComponent } from './thread/thread.component';
import { ThreadService } from '../services/thread.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MatCardModule, ChannelComponent, MainMenuComponent, MainHeaderComponent, RouterModule, CommonModule, ThreadComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})

export class MainPageComponent {
  isMenuOpen: boolean = true;

  constructor(public userService: UserService, 
    public channelService: ChannelFirebaseService, 
    public threadService : ThreadService,
    public sharedService: SharedService) {
    if (this.userService.currentUser) this.channelService.getChannelsForCurrentUser();
    if (this.userService.currentUser.last_thread && this.userService.currentUser.last_thread != '') {
      this.threadService.threadOpen = true;
    }
  }

  // toggleMenu(): void {
  //   this.isMenuOpen = !this.isMenuOpen;
  // }

  ngOnInit(): void {
    this.sharedService.backToChannels$.subscribe(() => {
      // this.isMenuOpen = true;
      this.toggleMenu();
    });
  }

  toggleMenu(): void {
    //opens smoothly and gives channel + thread the remaining space
    this.sharedService.isMenuOpen$.next(this.isMenuOpen);
    const menuElement = document.getElementById('menu-none');
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      setTimeout(() => {
        if (menuElement) {
          menuElement.style.display = 'none';
        }
      }, 500);
    } else {
      if (menuElement) {
        menuElement.style.display = 'block';
      }
      setTimeout(() => {
        this.isMenuOpen = true;
      }, 100);
      
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (event.target.innerWidth < 1500 && event.target.innerWidth > 768) {
      if (this.isMenuOpen) {
      this.toggleMenu();
      }
    } if (event.target.innerWidth < 768) {
      //nothing
    }
    else {
      const menuElement = document.getElementById('menu-none');
      if (menuElement) {
        menuElement.style.display = 'block';
      }
      setTimeout(() => {
        this.isMenuOpen = true;
        this.threadService.threadOpen = false;
      }, 100);
      
    }
  }
}