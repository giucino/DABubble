import { Injectable } from '@angular/core';
import { UserService } from '../firebase.service/user.service';
import { CustomDialogService } from './custom-dialog.service';
import { DialogShowProfileComponent } from '../shared/dialog-show-profile/dialog-show-profile.component';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public isOwnProfile: boolean = false;
  private viewingUserId: string | null = null;

  constructor(private userService: UserService, private customDialogService: CustomDialogService) {}

  openProfile(userId: string, button: HTMLElement): void {
    const isOwnProfile = userId === this.userService.currentUser.id;
    this.setOwnProfileStatus(isOwnProfile);
    this.setViewingUserId(userId);

    const component = DialogShowProfileComponent;
    let userHeadButton = document.getElementById('userHead');
    if (isOwnProfile && userHeadButton) {
      this.customDialogService.openDialogAbsolute(userHeadButton, component, 'right');
    } else {
      this.customDialogService.openDialog(component);
    }
    
  }

  setOwnProfileStatus(status: boolean): void {
    this.isOwnProfile = status;
  }

  getOwnProfileStatus(): boolean {
    return this.isOwnProfile;
  }

  setViewingUserId(userId: string | null): void {
    this.viewingUserId = userId;
  }

  getViewingUserId(): string | null {
    return this.viewingUserId;
  }
}
