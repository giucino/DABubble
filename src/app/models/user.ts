export class User {
    id?: string;
    name: string;
    email: string;
    password: string;
    logged_in: boolean;
    is_typing: boolean;
    profile_img: string;
    // last_channel: string,

    constructor(obj?: any){
        this.id = obj ? obj.id : '';
        this.name = obj ?obj.name : '';
        this.email = obj ? obj.email : '';
        this.password = '';
        this.logged_in = obj ? obj.logged_in : '';
        this.is_typing = obj ? obj.is_typing : '';
        this.profile_img = obj ? obj.profile_img : '';
        // this.last_channel = obj ? obj.last_channel : '';
    }

    public toJSON() {
        return {
            // id: this.id,
            name: this.name,
            email: this.email,
            password: 'Hackerman',
            logged_in: this.logged_in,
            is_typing: this.is_typing,
            profile_img: this.profile_img
            // last_channel: this.last_channel
        }
    }
}
