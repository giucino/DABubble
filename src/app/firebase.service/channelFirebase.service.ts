import { Injectable, inject } from '@angular/core';
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
  where,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { ChannelTypeEnum } from '../shared/enums/channel-type.enum';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelFirebaseService {
  firestore: Firestore = inject(Firestore);
  channels : Channel[] = [];
  currentChannel : Channel = {
    id: '',
    name: '',
    description: '',
    created_at: 0,
    creator: '', // 'user_id'
    members: [],
    active_members: [],
    channel_type: ChannelTypeEnum.new,
  }

  unsubChannels: any;

  constructor() {
  }

  getChannelsForCurrentUser(user_id: string) {
    this.unsubChannels = this.subChannels(user_id)
  }

  setCurrentChannel(channel_id : string) {
    let channel = this.channels.find((channel) => channel.id == channel_id);
    if(channel) this.currentChannel = channel;
    console.log('Current Channel: ', this.currentChannel);
  }

  ngOnDestroy(): void {
    this.unsubChannels();
}

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getChannelRef(channel_id : string) {
    return doc(collection(this.firestore, 'channels', channel_id))
  }

  setChannel(data : any, id: string) : Channel {
    return {
        id: id || '',
        name: data.name || '',
        description: data.description || '',
        created_at: data.created_at || 0,
        creator: data.creator || '', // 'user_id'
        members: data.members || [],
        active_members: data.active_members || [],
        channel_type: data.channel_type || '',
    }
  }

  /* CREATE */
  async addChannel(channel : Channel) {
    let ref = this.getChannelsRef();
    await addDoc(ref, channel)
        .catch((err) => {console.log(err)})
        .then(()=>{})
  }

  /* READ */ 
  subChannels(user_id : string) {
      // const q = query(this.getChannelsRef());
      const q = query(this.getChannelsRef(), where('members', 'array-contains', user_id));
      return onSnapshot( q , (channels) => {
          this.channels = [];
          channels.forEach((channel) => {
              this.channels.push(this.setChannel(channel.data(),channel.id));
          });
          if (this.currentChannel.id == '') this.setCurrentChannel(this.channels[0].id || '');
      })
  }


  /* UPDATE */
  async updateChannel(channel : Channel) {
      if (channel.id) {
          let docRef = doc(this.getChannelsRef(), channel.id);
          await updateDoc(docRef, JSON.parse(JSON.stringify(channel))).catch((err) => console.error(err))
      }
  }
}
