import { CommonModule } from '@angular/common';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { UserService } from '../../../firebase.service/user.service';
import { ChannelFirebaseService } from '../../../firebase.service/channelFirebase.service';

@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TextFieldModule],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss',
})
export class DialogEditChannelComponent implements OnInit{
  editChannelName: boolean = false;
  editChannelDescription: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditChannelComponent>,
    private _ngZone: NgZone,
    public userService: UserService,
    public channelService: ChannelFirebaseService
  ) {}

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  ngOnInit() {
  }

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
}
