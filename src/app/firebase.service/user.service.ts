import { HostListener, Inject, Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, DocumentData, addDoc, doc, updateDoc, deleteDoc, getDoc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';


@Injectable({
    providedIn: 'root'
})

export class UserService implements OnDestroy {
    firestore: Firestore = inject(Firestore);
    allUsers: any[] = [];
    user = new User();
    currentUser: any;

    unsubUsers;

    constructor() {
        this.unsubUsers = this.getUsers();
        this.getCurrentUser();
    }

    getUser(user_id: string) {
        return this.allUsers.find((user) => user.id == user_id);
    }

    getUsersByIds(ids: string[]): User[] {
        return ids.map(id => this.getUser(id)).filter(user => user !== undefined);
    }

    getUsers() {
        return onSnapshot(this.getUserRef(), (list) => {
            this.allUsers = [];
            list.forEach((element) => {
                let id = element.id;
                let data = element.data();
                this.allUsers.push(this.setUsers(data, id));
            });
        });
    }

    setUsers(data: any, id: string): User {
        return {
            id: id,
            name: data.name || '',
            email: data.email || '',
            password: '',
            logged_in: data.logged_in || false,
            is_typing: data.is_typing || false,
            profile_img: data.profile_img,
            last_channel: data.last_channel || '',
            toJSON() {
                return {
                    id: this.id,
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    logged_in: this.logged_in,
                    is_typing: this.is_typing,
                    profile_img: this.profile_img,
                    last_channel: this.last_channel,
                };
            }
        }

    }

    addDatabaseIdToUser(userId: string) {
        let singleUserRef = doc(this.getUserRef(), userId);
        updateDoc(singleUserRef, { id: userId });
    }

    async getCurrentUser(email?: string) {
        if (typeof window !== 'undefined' && window.localStorage) {
            
            const storedUser = localStorage.getItem('currentUser');
            if (email) {
                this.currentUser = this.allUsers.find(user => user.email === email);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            } else
            if (storedUser != '' && storedUser != null) {
                this.currentUser = JSON.parse(storedUser);
            }
            // else {
            //     this.currentUser = this.allUsers.find(user => user.email === email);
            // }
        }
    }

    ngOnDestroy(): void {
        this.unsubUsers();
    }

    getUserRef() {
        return collection(this.firestore, 'users');
    }

    getSingleUserRef(userId: string) {
        return doc(collection(this.firestore, 'users'), userId);
    }

    async addUser(user: User) {
        await addDoc(this.getUserRef(), user.toJSON());
    }

    async addGoogleUser(user: User) {
        if (this.getSingleUserRef(user.id)) {

            // user existiert schon
        } else {
            await this.addUser(user);
        }
    }


    addAvatarToUser(userId: string, avatar: string) {
        let singleUserRef = doc(this.getUserRef(), userId);
        updateDoc(singleUserRef, { profile_img: avatar });
    }

    async updateLastChannel(userId: string, channelId: string) {
        let singleUserRef = doc(this.getUserRef(), userId);
        await updateDoc(singleUserRef, { last_channel: channelId });
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.last_channel = channelId;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    async updateOnlineStatus(userId: string, status: boolean) {
        let singleUserRef = doc(this.getUserRef(), userId);
        await updateDoc(singleUserRef, { logged_in: status });
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.logged_in = status;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    getCleanJson(user: User): {} {
        return {
            name: user.name,
            email: user.email,
            password: '',
            logged_in: user.logged_in,
            is_typing: user.is_typing,
            profile_img: user.profile_img,
            last_channel: user.last_channel
        }
    }

    uploadImage(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const storage = getStorage();
            const storageRef = ref(storage, 'images/' + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    // use this section to display the upload progress
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    }

    async loadUser(userId: string) {
        this.getSingleUserRef(userId);
    }

    async deleteUser(userId: string) {
        try {
            await deleteDoc(doc(this.firestore, "users", userId));
        }
        catch (error) {
            console.error("Error removing document: ", error);
        }
    }


}