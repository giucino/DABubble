export interface Channel {
    id?: string,
    name : string,
    description : string,
    created_at: number,
    creator: {
        user_id: string,
        name: string,
    },
    members: string[],
    active_members: string[],
    channel_type: 'main' | 'direct' | 'thread' ,
}