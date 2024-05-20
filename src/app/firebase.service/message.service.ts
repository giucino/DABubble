import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  where,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Message } from '../interfaces/message.interface';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getBlob, getMetadata } from '@angular/fire/storage';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  firestore: Firestore = inject(Firestore);
  messages: Message[] = [];
  messagesThread: Message[] = [];
  message: Message = {
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
  };

  unsubMessages: any;
  unsubMessagesThread: any;
  // private unsubscribeAllMessages!: () => void;

  constructor() {}

  getMessagesFromChannel(channel_id: any) {
    this.unsubMessages = this.subMessages(channel_id);
  }

  getMessagesFromThread(thread_id: any) {
    this.unsubMessagesThread = this.subMessagesThread(thread_id);
  }

  getMessagesRef() {
    return collection(this.firestore, 'messages');
  }

  getMessageRef(message_id: string) {
    return doc(collection(this.firestore, 'messages', message_id));
  }

  setMessage(data: any, id?: string): Message {
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
    };
  }

  /* CREATE */
  async addMessage(message: Message) {
    let ref = this.getMessagesRef();
    const docRef = await addDoc(ref, message);
    return docRef.id;
  }

  /* READ */
  subMessages(channel_id: string) {
    const q = query(
      this.getMessagesRef(),
      where('channel_id', '==', channel_id),
      orderBy('created_at')
    );
    return onSnapshot(q, (messages) => {
      this.messages = [];
      messages.forEach((message) => {
        this.messages.push(this.setMessage(message.data(), message.id));
      });
    });
  }

  subMessagesThread(thread_id: string) {
    const q = query(
      this.getMessagesRef(),
      where('thread_id', '==', thread_id),
      orderBy('created_at')
    );
    return onSnapshot(q, (messages) => {
      this.messagesThread = [];
      messages.forEach((message) => {
        this.messagesThread.push(this.setMessage(message.data(), message.id));
      });
    });
  }

  /* UPDATE */
  async updateMessage(message: Message) {
    if (message.id) {
      let docRef = doc(this.getMessagesRef(), message.id);
      await updateDoc(docRef, JSON.parse(JSON.stringify(message))).catch(
        (err) => console.error(err)
      );
    }
  }

  // getAllMessages() {
  //     const allMessagesQuery = query(this.getMessagesRef());
  //     this.unsubscribeAllMessages = onSnapshot(allMessagesQuery, (querySnapshot) => {
  //         this.messages = [];
  //         querySnapshot.forEach((doc) => {
  //             const message = this.setMessage(doc.data(), doc.id);
  //             this.messages.push(message);
  //         });
  //     });
  // }

  /* STORAGE */

//   storage = getStorage(); // reference to storage service
//   storageRef = ref(this.storage); // reference to storage
//   // imagesRef = ref(this.storage, 'images');
//   // pdfsRef = ref(this.storage, 'pdfs');
//   messageAttachmentsRef = ref(this.storage, 'messageAttachements');

  uploadFile(file: File, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // const path = file.type == 'application/pdf' ? 'pdfs/' + file.name : 'images/' + file.name;
      const storage = getStorage();
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // use this section to display the upload progress
        },
        (error) => {
          reject(error);
        },
        () => {
          // const url = getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //   resolve(downloadURL);
          // });
          // return path;
        }
      );
    });
  }

  async getFileData(path : string) {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    const metadata = await getMetadata(storageRef);
    return {
      path : path,
      name : metadata.name,
      type : metadata.contentType,
      url : url,
     }
  }

  async downloadFile(path: string) {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    const url = await getDownloadURL(storageRef);
    try {
        // Bilddaten als Blob holen
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error('Netzwerkantwort war nicht ok.');

        const blob = await response.blob();

        // Blob-URL erstellen
        const blobUrl = window.URL.createObjectURL(blob);

        // Temporären Link erstellen
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = metadata.name;

        // Link zum DOM hinzufügen
        document.body.appendChild(a);
        a.click();

        // Bereinigen
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Fehler beim Herunterladen des Bildes:', error);
    }
  }

  // async getStorageFileURL(path: string) {
  //   const storage = getStorage();
  //   const storageRef = ref(storage, path);
  //   const URL = await getDownloadURL(storageRef);
  //   return URL;
  // }
}
