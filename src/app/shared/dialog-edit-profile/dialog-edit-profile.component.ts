import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../firebase.service/user.service';
import { UserAuthService } from '../../firebase.service/user.auth.service';
import { User } from '../../interfaces/user.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import e from 'express';
import { Router } from '@angular/router';

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
  avatars = [
    'assets/img/avatar-1.jpg',
    'assets/img/avatar-2.jpg',
    'assets/img/avatar-3.jpg',
    'assets/img/avatar-4.jpg',
    'assets/img/avatar-5.jpg',
    'assets/img/avatar-6.jpg',
  ];
  emailExists: boolean = false;
  changeAvatar: boolean = false;
  thisAvatar: string = this.userService.currentUser?.profile_img; 
  imageChanged: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<DialogEditProfileComponent>,
    public userService: UserService,
    public userAuth: UserAuthService,
    public router: Router
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

  openAvatarDialog() {
    this.changeAvatar = true;
  }

  closeAvatarDialog() {
    if (this.changeAvatar) {
      this.userService.currentUser.profile_img = this.thisAvatar; // instant change
      this.router.navigate(['/main-page']);
      // this.userService.unsubUsers();
      this.changeAvatar = false;
    }
    
  }

  async changeUserAvatar(i : number) {
    //set avatar
    this.thisAvatar = this.avatars[i];

    // speichern in service und localstorage
    await this.userService.updateUserImage(this.userService.currentUser.id, this.thisAvatar);

    this.imageChanged = true;
    
  }

  async uploadAvatar(event: any) {
    const file = event.target.files[0];
    const imageUrl = await this.userService.uploadImage(file);
    this.thisAvatar = imageUrl;
    await this.userService.updateUserImage(this.userService.currentUser.id, this.thisAvatar);
    this.closeAvatarDialog();
    this.imageChanged = true;
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
      this.userService.currentUser.name = displayName; //instant change
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
