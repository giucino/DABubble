import { Injectable, signal } from '@angular/core';
import { Channel } from '../interfaces/channel.interface';
import { ChannelTypeEnum } from '../shared/enums/channel-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelsSig = signal<Channel[]>([]);
  channelTypSig = signal<ChannelTypeEnum>(ChannelTypeEnum.main);

  constructor() {}

  // changeChannel(channelName: ChannelTypeEnum): void {
  //   this.channelTypSig.set(channelName);
  // }

  addChannel(
    name: string,
    description: string,
    created_at: number,
    creator: string,
    members: string[],
    active_members: string[],
    channel_type: ChannelTypeEnum,
    id?: string
  ): void {
    const newChannel: Channel = {
      id,
      name,
      description,
      created_at,
      creator,
      members,
      active_members,
      channel_type,
    };
  
    this.channelsSig.update((channels) => [...channels, newChannel]);
  }
  

  // removeChannel(id: string): void {
  //   this.channelsSig.update((channels) =>
  //     channels.channel((channel) => channel.id !== id)
  //   );
  // }
}
