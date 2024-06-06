import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  threadOpen : boolean = false;

  constructor() { }

  
  openThread() {
    this.threadOpen = true;
  }


  closeThread() {
    this.threadOpen = false;
  }
}
