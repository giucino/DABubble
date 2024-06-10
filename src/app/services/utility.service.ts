import { Injectable } from '@angular/core';
import { ChannelFirebaseService } from '../firebase.service/channelFirebase.service';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];
  constructor(private channelService: ChannelFirebaseService) { }


  convertToDate(dateAsNumber: number) {
    let date = new Date(dateAsNumber);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth() + 1;
    let y: number | string = date.getFullYear();
    if (d < 10) d = '0' + d;
    if (m < 10) m = '0' + m;
    let result = y + '/' + m + '/' + d;
    return result;
  }


  getChannelCreationTime() {
    let date = new Date(this.channelService.currentChannel.created_at);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth();
    let y = date.getFullYear();
    if (
      this.convertToDate(new Date().getTime()) ==
      this.convertToDate(this.channelService.currentChannel.created_at)
    ) {
      return 'heute';
    } else {
      return 'am' + ' ' + d + '. ' + this.months[m] + ' ' + y;
    }
  }


  getMessageCreationTime(message: Message) {
    let date = new Date(message.created_at);
    let d: number | string = date.getDate();
    let m: number | string = date.getMonth();
    let y = date.getFullYear();
    if (
      this.convertToDate(new Date().getTime()) ==
      this.convertToDate(message.created_at)
    ) {
      return 'heute';
    } else {
      return 'am' + ' ' + d + '. ' + this.months[m] + ' ' + y;
    }
  }
}
