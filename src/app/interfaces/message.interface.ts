export interface Message {
    id?: string,
    user_id: string,
    channel_id: string,
    thread_id?: string,
    message: {
        text: string, 
        reactions?: string[],
        attachements?: string[], 
    },
    created_at: number,
    modified_at?: number,
    is_deleted: boolean,
    total_replies?: number,
    last_reply?: number,
}