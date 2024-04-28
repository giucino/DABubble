import { Injectable, OnDestroy, inject } from '@angular/core';
import { Channel } from '../interfaces/channel.interface';
import {
  Firestore,
  collection,
  collectionData,
  onSnapshot,
  DocumentData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from '@angular/fire/firestore';
import { ChannelTypeEnum } from '../shared/enums/channel-type.enum';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelFirebaseService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  channelsCollection = collection(this.firestore, 'channels');

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  getChannels(): Observable<Channel[]> {
    return collectionData(this.channelsCollection, {
      idField: 'id',
    }) as Observable<Channel[]>;
  }

  addChannel(
    name: string,
    description: string,
    created_at: number,
    creator: string,
    members: string[],
    active_members: string[],
    channel_type: ChannelTypeEnum,
    id?: string
  ): Observable<string> {
    const channelToCreate = { name, description, created_at, creator, members, active_members, channel_type};
    const promise = addDoc(this.channelsCollection, channelToCreate).then(
      (response) => response.id
    );
    return from(promise);
  }
}
