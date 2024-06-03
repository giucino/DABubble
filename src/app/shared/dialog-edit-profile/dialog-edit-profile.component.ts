import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../firebase.service/user.service';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { User } from '../../interfaces/user.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import e from 'express';

@Component({
  selector: 'app-dialog-edit-profile',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-edit-profile.component.html',
  styleUrl: './dialog-edit-profile.component.scss',
})
export class DialogEditProfileComponent implements OnInit {
  editForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl({ value: '', disabled: this.isEmailDisabled() }, [
      Validators.required,
      Validators.email,
    ]),
  });
  emailExists: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditProfileComponent>,
    public userService: UserService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    
    this.userAuth.currentUser().then((user) => {
      if (user) {
        this.editForm.patchValue({
          name: user.displayName,
          email: user.email,
        });
        if (this.isEmailDisabled()) {
          this.editForm.get('email')?.disable();
        } else {
          this.editForm.get('email')?.enable();
        }
        // console.log(this.editForm.get('email')?.value);
      }
    });
  }

  emailPlaceholder(): string {
    return this.userService.currentUser?.email == this.userAuth.googleEmail
      ? 'Kann hier nicht bearbeitet werden'
      : this.userService.currentUser?.email;
  }

  isEmailDisabled(): boolean {
    return this.userService.currentUser?.email == this.userAuth.googleEmail;
  }

  // async onSubmit(): Promise<void> {
  //   if (this.editForm.valid) {
  //     const displayName = this.editForm.get('name')?.value || '';
  //     const email = this.editForm.get('email')?.value || '';

  //     try {
  //       await this.userAuth.updateUserProfile({
  //         displayName: displayName,
  //         email: email,
  //       });

  //       const tempSubscription = this.userService
  //       .getRealtimeUser(this.userService.currentUser.id)
  //       .subscribe({
  //         next: (user) => {
  //           this.userService.currentUser = user;
  //           tempSubscription.unsubscribe();
  //           // console.log('subscribed', this.userService.currentUser);
  //           // console.log('Unsubscribed after single use');
  //           this.dialogRef.close();
  //         },
  //           error: (error) => {
  //             console.error('Failed to get user data:', error);
  //             tempSubscription.unsubscribe();
  //           },
  //         });
  //       } catch (error) {
  //         console.error('Fehler beim Aktualisieren des Benutzers:', error);
  //       }
  //     }
  //   }



  
   
  //Checks if the input value is different from the current user's name and email
  //If the input value is different, it will update the user's name and/or email
  
  async onSubmit() {
  if (this.editForm.valid) {
    const displayName = this.editForm.get('name')?.value;
    const email = this.editForm.get('email')?.value;
    if (displayName != this.userService.currentUser.name) {
      await this.userAuth.changeCurrentUser(displayName);
      this.dialogRef.close();
    }
    if (email != this.userService.currentUser.email) {
      const emailExists = await this.userAuth.emailExists(email);
      if (emailExists) {
        this.emailExists = true;
        return;
      }
      this.emailExists = false;
      await this.userAuth.changeCurrentUser(email);
      this.dialogRef.close();
    }
    else {
      // this.dialogRef.close();
      return;
    }

  }
}
}
