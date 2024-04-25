export interface User {
    id?: string,
    name: string,
    email: string,
    password: string,
    logged_in: boolean,
    is_typing: boolean,
    profile_img: string,
    // last_channel: string,
}