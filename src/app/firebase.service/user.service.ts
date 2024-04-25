import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, DocumentData, addDoc, doc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getFirestore } from "firebase/firestore";
import { User } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {
    firestore: Firestore = inject(Firestore);
    allUsers: any[] = [];
    userInt = new UserService();

    // unsubUsers;

    constructor() {
            // this.unsubUsers = this.getUsers()
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
        // throw new Error('Method not implemented.');
    }

    getUserRef() {
        return collection(this.firestore, 'users');
    }

    getSingleUserRef(colId: string, userId: string) {
        return doc(collection(this.firestore, colId), userId);
    }

    async addUser(user: UserService){
        await addDoc(this.getUserRef(), user); // user.toJSON eventuell
    }

    async updateUser(userId: string, updatedUser: UserService){
        let singleUserRef = doc(this.getUserRef(), userId);
        await updateDoc(singleUserRef, updatedUser);
    }
}