export interface Message {
    id?: string,
    user_id: string,
    channel_id: string,
    thread_id?: string,
    message: {
        text: string, // 'This is an example <@user_id> <#channel_id>'
        reactions?: string[], // 'reaction_id_1', 'reaction_id_2' ...
        attachements?: string[], // 'img.jpg' , 'document.pdf' ...
    },
    created_at: number,
    modified_at?: number,
    is_deleted: boolean,
    total_replies?: number,
    last_reply?: number,

    // googleName?: string,
    // googleProfileImg?: string,
}