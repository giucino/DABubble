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
  getDocs,
} from '@angular/fire/firestore';
import { ChannelTypeEnum } from '../shared/enums/channel-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ChannelFirebaseService {
  firestore: Firestore = inject(Firestore);
  channels: Channel[] = [];

  currentChannel: Channel = {
    id: '',
    name: '',
    description: '',
    created_at: 0,
    creator: '', // 'user_id'
    members: [],
    active_members: [],
    channel_type: ChannelTypeEnum.new,
  };

  currentThread: Channel = {
    id: '',
    name: '',
    description: '',
    created_at: 0,
    creator: '', // 'user_id'
    members: [],
    active_members: [],
    channel_type: ChannelTypeEnum.thread,
  };

  

  unsubChannels: any;
  unsubCurrentChannel: any = function () {};
  unsubCurrentThread: any = function () {};
  // private unsubscribeCurrentChannel?: () => void;

  constructor() {
    // this.unsubCurrentChannel = this.getCurrentChannel();
    console.log('currentChannel im Constructor Service' , this.currentChannel)
  }


  // ohne user_id
  async getChannelsForCurrentUser(){
    const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                // If the user is logged in, set this.currentUser to the stored user
                let currentUser = await JSON.parse(storedUser);
                this.unsubChannels =  this.subChannels(currentUser.id);
            } 
  }


  getDirectChannelId(currentUser_id: string, dm_target_id: string) : string {
    let directChannels = this.channels.filter((channel) => channel.channel_type == 'direct');
    let channel = undefined;
    if (currentUser_id == dm_target_id) {
      channel = directChannels.find((channel) => channel.members.length == 1);
    } else {
      channel = directChannels.find((channel) => channel.members.includes(dm_target_id));
    };
    if (channel) return channel.id;
    else return '';
  }

  setCurrentChannel(channel_id: string) {
    let channel = this.channels.find((channel) => channel.id == channel_id);
    if (channel) this.currentChannel = channel;
  }

  getCurrentChannel(channel_id : string) {
    return onSnapshot(this.getChannelRef(channel_id), (channel) => {
      this.currentChannel = this.setChannel(channel.data(), channel.id);
    });
  }

  getCurrentThread(thread_id : string) {
    return onSnapshot(this.getChannelRef(thread_id), (channel) => {
      this.currentThread = this.setChannel(channel.data(), channel.id);
    });
  }

  ngOnDestroy(): void {
    if(this.unsubChannels === typeof function () {}) this.unsubChannels();
    // this.unsubCurrentChannel();
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  getChannelRef(channel_id: string) {
    return doc(collection(this.firestore, 'channels'), channel_id);
  }

  setChannel(data: any, id: string): Channel {
    return {
      id: id || '',
      name: data.name || '',
      description: data.description || '',
      created_at: data.created_at || 0,
      creator: data.creator || '', // 'user_id'
      members: data.members || [],
      active_members: data.active_members || [],
      channel_type: data.channel_type || '',
    };
  }

  /* CREATE */
  async addChannel(channel: Channel): Promise<string> {
    let ref = this.getChannelsRef();
    const docRef = await addDoc(ref, channel);
    return docRef.id;
  }

  /* READ */
  subChannels(user_id: string) {
    const q = query(
      this.getChannelsRef(),
      where('members', 'array-contains', user_id)
    );
    return onSnapshot(q, (channels) => {
      this.channels = [];
      channels.forEach((channel) => {
        this.channels.push(this.setChannel(channel.data(), channel.id));
      });
      // if (this.channels.length > 0) {
      //   if (this.currentChannel.id == '')
      //     this.setCurrentChannel(this.channels[0].id || '');
      // }
    });
  }

  /* UPDATE */
  async updateChannel(channel: Channel) {
    if (channel.id) {
      let docRef = doc(this.getChannelsRef(), channel.id);
      await updateDoc(docRef, JSON.parse(JSON.stringify(channel))).catch(
        (err) => console.error(err)
      );
    }
  }

  async updateChannelMembers(
    channelId: string,
    newMemberIds: string[]
  ): Promise<void> {
    try {
      const currentChannel = this.channels.find(
        (channel) => channel.id === channelId
      );
      if (!currentChannel) {
        throw new Error('Channel nicht gefunden');
      }

      const updatedMemberIds = Array.from(
        new Set([currentChannel.creator, ...newMemberIds])
      );

      const docRef = doc(this.getChannelsRef(), channelId);
      await updateDoc(docRef, { members: updatedMemberIds });
      // console.log('Mitgliederliste erfolgreich aktualisiert:', updatedMemberIds);

      currentChannel.members = updatedMemberIds;
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Mitgliederliste:', error);
    }
  }

  // getAllChannels() {
  //   const allChannelsQuery = query(this.getChannelsRef());
  //   this.unsubscribeAllChannels = onSnapshot(allChannelsQuery, (querySnapshot) => {
  //     this.channels = [];
  //     querySnapshot.forEach((doc) => {
  //       const channel = this.setChannel(doc.data(), doc.id);
  //       this.channels.push(channel);
  //     });
  //   });
  // }


async getAllChannels(): Promise<Channel[]> {
  const allChannelsQuery = query(this.getChannelsRef());
  return getDocs(allChannelsQuery).then((querySnapshot) => {
    this.channels = [];
    querySnapshot.forEach((doc) => {
      const channel = this.setChannel(doc.data(), doc.id);
      this.channels.push(channel);
    });
    return this.channels;
  }).catch(error => {
    console.error("Fehler beim Abrufen der Kanäle: ", error);
    return []; 
  });
}

}
