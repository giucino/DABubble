export interface Reaction {
    id?: string,
    message_id: string,
    unicode: string, 
    users: string[], // 'user_id_1', 'user_id_2'
}