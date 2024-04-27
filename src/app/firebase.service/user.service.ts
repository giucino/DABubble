import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, DocumentData, addDoc, doc, updateDoc, deleteDoc, getDoc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getFirestore } from "firebase/firestore";
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {
    firestore: Firestore = inject(Firestore);
    allUsers: any[] = [];
    user = new User();


    unsubUsers;

    constructor() {
            this.unsubUsers = this.getUsers()
    }
    
    getUsers() {
        return onSnapshot(this.getUserRef(), (list) => {
            this.allUsers = [];
            list.forEach((element) => {
                let id = element.id;
                let data = element.data();
                let userData = { id, data };
                this.allUsers.push(userData);
            });
        });
    }

    ngOnDestroy(): void {
        this.unsubUsers();
    }

    getUserRef() {
        return collection(this.firestore, 'users');
    }

    getSingleUserRef(colId: string, userId: string) {
        return doc(collection(this.firestore, colId), userId);
    }

    async addUser(user: User){
        // await addDoc(this.getUserRef(), user); // user.toJSON eventuell
        await addDoc(this.getUserRef(), user.toJSON());
    }

    async updateUser(userId: string, updatedUser: User){
        let singleUserRef = doc(this.getUserRef(), userId);
        await updateDoc(singleUserRef, updatedUser.toJSON());
    }

    getCleanJson(user: User):{}{
        return {
            name: user.name,
            email: user.email,
            password: user.password,
            logged_in: user.logged_in,
            is_typing: user.is_typing,
            profile_img: user.profile_img,
            // last_channel: userInt.last_channel
        }
    }

    async loadUser(userId: string){
        this.getSingleUserRef('users', userId);
    }

    async deleteUser(userId: string){
        // try{
            // await deleteDoc(doc(this.firestore, "users", userId));
            // console.log("User deleted successfully.");
        // }
        //  catch (error) {
            // console.error("Error removing document: ", error);
        // }
    }
}