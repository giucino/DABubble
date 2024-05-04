import { Injectable, OnDestroy, Query, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, DocumentData, addDoc, doc, updateDoc, deleteDoc, getDoc, where, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../interfaces/message.interface';
// import { getFirestore } from "firebase/firestore";


@Injectable({
    providedIn: 'root'
})

export class MessageService implements OnDestroy {
    
    firestore: Firestore = inject(Firestore);
    messages : Message[] = [];
    message : Message = {
        user_id: '',
        channel_id: '',
        thread_id: '',
        message: {
            text: '',
            reactions: [],
            attachements: [],
        },
        created_at: 0,
        modified_at: 0,
        is_deleted: false,
        total_replies: 0,
    }

    unsubMessages : any;
    private unsubscribeAllMessages!: () => void;

    constructor() {

    }

    getMessagesFromChannel(channel_id : string) {
        this.unsubMessages = this.subMessages(channel_id);
    }

    ngOnDestroy(): void {
        this.unsubMessages();
        if (this.unsubscribeAllMessages) {
            this.unsubscribeAllMessages();
        }
        console.log('unsubscribed');
    }

    getMessagesRef() {
        return collection(this.firestore, 'messages')
    }

    getMessageRef(message_id : string) {
        return doc(collection(this.firestore, 'messages', message_id))
    }

    setMessage(data : any, id?: string) : Message {
        return {
            id: id || '',
            user_id: data.user_id || '',
            channel_id: data.channel_id || '',
            thread_id: data.thread_id || '',
            message: {
                text: data.message.text || '', // 'This is an example <@user_id> <#channel_id>'
                reactions: data.message.reactions || [], // 'reaction_id_1', 'reaction_id_2' ...
                attachements: data.message.attachements || [], // 'img.jpg' , 'document.pdf' ...
            },
            created_at: data.created_at || 0,
            modified_at: data.modified_at || 0,
            is_deleted: data.is_deleted || false,
            total_replies: data.total_replies || 0,
            last_reply: data.last_reply || 0,
        }
    }


    /* CREATE */
    async addMessage(message : Message) {
        let ref = this.getMessagesRef();
        await addDoc(ref, message)
            .catch((err) => {console.log(err)})
            .then(()=>{})
    }

    /* READ */ 
    subMessages(channel_id : string) {
        const q = query(this.getMessagesRef(), where('channel_id', '==', channel_id), orderBy("created_at"));
        return onSnapshot( q , (messages) => {
            this.messages = [];
            messages.forEach((message) => {
                this.messages.push(this.setMessage(message.data(),message.id))
            });
        })
    }

    /* UPDATE */
    async updateMessage(message : Message) {
        if (message.id) {
            let docRef = doc(this.getMessagesRef(), message.id);
            await updateDoc(docRef, JSON.parse(JSON.stringify(message))).catch((err) => console.error(err))
        }
    }

    getAllMessages() {
        const allMessagesQuery = query(this.getMessagesRef());
        this.unsubscribeAllMessages = onSnapshot(allMessagesQuery, (querySnapshot) => {
          this.messages = [];
          querySnapshot.forEach((doc) => {
            const message = this.setMessage(doc.data(), doc.id);
            this.messages.push(message);
          });
        });
      }

}