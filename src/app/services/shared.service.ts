import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// um allgemein funktionen zwischen den komponenten zu teilen/nutzen
export class SharedService {

  private showMobileDivSubject = new Subject<void>();
  private backToChannelsSubject = new Subject<void>();

  backToChannels$ = this.backToChannelsSubject.asObservable();
  showMobileDiv$ = this.showMobileDivSubject.asObservable();
  constructor() { }

  showMobileDiv() {
    this.showMobileDivSubject.next();
  }

  backToChannels() {
    this.backToChannelsSubject.next();         
  }

  subscribeToBackToChannels(toggleMenu: () => void): Subscription {
    return this.backToChannels$.subscribe(toggleMenu);
  }


  ngonDestroy() {
    this.backToChannelsSubject.unsubscribe();
    this.showMobileDivSubject.unsubscribe();
  }
}