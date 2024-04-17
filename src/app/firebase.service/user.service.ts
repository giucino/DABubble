import { Injectable, OnDestroy, inject } from '@angular/core';
// import { Firestore, collection, onSnapshot, DocumentData, addDoc, doc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
// import { getFirestore } from "firebase/firestore";


@Injectable({
    providedIn: 'root'
})

export class UserService implements OnDestroy {
    // firestore: Firestore = inject(Firestore);

    ngOnDestroy(): void {
        // throw new Error('Method not implemented.');
    }




}