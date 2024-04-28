import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, DocumentData, addDoc, doc, updateDoc, deleteDoc, getDoc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getFirestore } from "firebase/firestore";
import { User } from '../models/user';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';

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

    getSingleUserRef(userId: string) {
        return doc(collection(this.firestore, 'users'), userId);
    }

    async addUser(user: User){
        await addDoc(this.getUserRef(), user.toJSON());
    }

    addAvatarToUser(userId: string, avatar: string){
        let singleUserRef = doc(this.getUserRef(), userId);
        updateDoc(singleUserRef, {profile_img: avatar});
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

    uploadImage(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const storageRef = ref(storage, 'images/' + file.name);
      
          const uploadTask = uploadBytesResumable(storageRef, file);
      
          uploadTask.on('state_changed', 
            (snapshot) => {
              // You can use this section to display the upload progress
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

    async loadUser(userId: string){
        this.getSingleUserRef(userId);
    }

    async deleteUser(userId: string){
        try{
            await deleteDoc(doc(this.firestore, "users", userId));
        }
         catch (error) {
            console.error("Error removing document: ", error);
        }
    }
}