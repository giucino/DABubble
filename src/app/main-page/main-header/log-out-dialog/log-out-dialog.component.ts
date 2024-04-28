import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserAuthService } from '../../../firebase.service/user.auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-log-out-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './log-out-dialog.component.html',
  styleUrl: './log-out-dialog.component.scss'
})
export class LogOutDialogComponent {
  constructor(public dialogRef: MatDialogRef<LogOutDialogComponent>, 
    private userAuth: UserAuthService, private router: Router) {}

  onNoClick(): void {
    this.dialogRef.close();
    console.log('Dialog closed'); 
  }

  openCurrentUser(): void {
    console.log('Open profile');
    this.dialogRef.close();
  }

  logOut() {
    console.log('Logging out');
    
    // sobald logged in user funktioniert
    // this.userAuth.logout().then(() => { 
    //   this.router.navigate(['/login']);
    //   this.dialogRef.close();
    // });

    this.router.navigate(['/login']);
    this.dialogRef.close();
  }
}
