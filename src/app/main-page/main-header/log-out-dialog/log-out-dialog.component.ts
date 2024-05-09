import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogShowProfileComponent } from '../../../shared/dialog-show-profile/dialog-show-profile.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { ProfileService } from '../../../services/profile.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserAuthService } from '../../../firebase.service/user.auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../firebase.service/user.service';


@Component({
  selector: 'app-log-out-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-out-dialog.component.html',
  styleUrl: './log-out-dialog.component.scss',
})
export class LogOutDialogComponent {
  @Output() showProfileClicked = new EventEmitter<void>();
  constructor(
    public dialogRef: MatDialogRef<LogOutDialogComponent>,
    private customDialogService: CustomDialogService,
    private profileService: ProfileService, private userAuth: UserAuthService, private router: Router, private userService: UserService
  ) {}

  openCurrentUser(button: HTMLElement): void {
    this.profileService.setOwnProfileStatus(true); 
    const component = DialogShowProfileComponent;
    this.customDialogService.openDialogAbsolute(button, component, 'right');    
    this.showProfileClicked.emit();
    this.dialogRef.close();
  }

  logOut(): void {
    localStorage.removeItem('currentUser');
    this.userAuth.logout().then(() => { 
      this.router.navigate(['/login-page']);
      this.dialogRef.close();
      this.userService.updateOnlineStatus(this.userService.currentUser.id, false);
    });
  }
}
