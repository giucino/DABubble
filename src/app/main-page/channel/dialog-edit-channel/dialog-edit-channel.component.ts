import { CommonModule } from '@angular/common';
import { Component, NgZone, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogAddMemberMobileComponent } from '../dialog-add-member-mobile/dialog-add-member-mobile.component';
import { CustomDialogService } from '../../../services/custom-dialog.service';
import { MessageService } from '../../../firebase.service/message.service';

@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TextFieldModule, FormsModule],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss',
})
export class DialogEditChannelComponent implements OnInit {
  editChannelName: boolean = false;
  editChannelDescription: boolean = false;
  tempChannelName!: string;
  tempChannelDescription!: string;
  selectedUserId: string = '';
  channelExists: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditChannelComponent>,
    private _ngZone: NgZone,
    public userService: UserService,
    public channelService: ChannelFirebaseService,
    private router: Router,
    public customDialogService: CustomDialogService,
    public messageService: MessageService
  ) { }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit(): void {
    this.tempChannelName = this.channelService.currentChannel.name;
    this.tempChannelDescription =
      this.channelService.currentChannel.description;
  }

  openAddUserDialog(button: HTMLElement) { // anderen
    const component = DialogAddMemberMobileComponent;
    this.customDialogService.openDialogAbsolute({ button, component, position: 'mid', mobilePosition: 'bottom', maxWidth: '100dvw' });
    // this.dialogRef.close();
  }

  // private unsubscribe$ = new Subject<void>();

  // ngOnInit() {
  //   this.channelService.currentChannel$
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe(channel => {
  //       if (channel) {
  //         this.tempChannelName = channel.name;
  //         this.tempChannelDescription = channel.description;
  //       }
  //     });
  //     console.log('DialogEditChannelComponent initialized');
  // }

  // ngOnDestroy() {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  //   console.log('DialogEditChannelComponent destroyed');
  // }

  getCreatorName(userId: string): string {
    const user = this.userService.getUser(userId);
    return user ? user.name : 'Unbekannter Benutzer';
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  // updateEditedChannel(): void {
  //   this.channelService.currentChannel.name = this.tempChannelName;
  //   this.channelService.currentChannel.description = this.tempChannelDescription;
  //   this.channelService
  //     .updateChannel(this.channelService.currentChannel)
  //     .then(() => {
  //       this.cancelEditing();
  //     })
  //     .catch((error) => {
  //       console.error('Fehler beim Aktualisieren des Channels:', error);
  //     });
  // }

  async updateEditedChannel(): Promise<void> {
      if (this.duplicateChannelName()) {
        this.channelExists = true;
        return;
      } else {
        this.changeChannelName();
      }
  }

  async changeChannelName(): Promise<void> {
    this.channelExists = false;
    this.channelService.currentChannel.name = this.tempChannelName;
    this.channelService.currentChannel.description = this.tempChannelDescription;
    await this.channelService.updateChannel(this.channelService.currentChannel);
    this.cancelEditing();
    this.dialogRef.close();
  }


  duplicateChannelName(): boolean {
    return this.channelService.channels.some(
      (channel) =>
        channel.name === this.tempChannelName &&
        channel.id !== this.channelService.currentChannel.id
    );
  }

  cancelEditing(): void {
    this.editChannelName = false;
    this.editChannelDescription = false;
  }

  // async leaveChannel(): Promise<void> {
  //   try {
  //     await this.channelService.removeUserFromChannel(
  //       this.channelService.currentChannel.id,
  //       this.userService.currentUser.id
  //     );
  //     this.dialogRef.close();
  //     console.log('Erfolgreich aus dem Kanal entfernt', this.channelService.currentChannel, this.userService.currentUser);
  //   }
  //   catch (error) {
  //     console.error('Fehler beim Verlassen des Kanals', error);
  //   }
  // }

  async leaveChannel(): Promise<void> {
    if (!this.channelService.currentChannel || !this.channelService.currentChannel.id) {
      console.error('Der aktuelle Kanal ist nicht definiert oder hat keine ID.');
      return;
    }
    try {
      await this.channelService.removeUserFromChannel(
        this.channelService.currentChannel.id,
        this.userService.currentUser.id
      );
      this.dialogRef.close();
      // console.log('Erfolgreich aus dem Kanal entfernt', this.channelService.currentChannel, this.userService.currentUser);
      this.channelService.openNewChannel(this.userService.currentUser.id);
      this.router.navigate(['/main-page/' + this.channelService.currentChannel.id]);
    } catch (error) {
      console.error('Fehler beim Verlassen des Kanals', error);
    }
  }


  // leaveChannel(): void {
  //   this.channelService
  //     .removeUserFromChannel(this.channelService.currentChannel.id, this.userService.currentUser.id)
  //     .then(() => {
  //       this.dialogRef.close();
  //       // this.router.navigate(['/main-page/' + this.userService.currentUser.last_channel]);
  //       // this.router.navigateByUrl('/main-page/' + this.userService.currentUser.last_channel)
  //       console.log('Erfolgreich aus dem Kanal entfernt');
  //     })
  //     .catch((error) => {
  //       console.error('Fehler beim Verlassen des Kanals', error);
  //     });
  // }
}
