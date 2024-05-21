import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  updatePassword,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { UserService } from './user.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  firestore: Firestore = inject(Firestore);
  displayName: string = '';
  googleName: any = '';
  googleEmail: any = '';
  googleProfileImg: any = '';
  // googleId: any = '';

  constructor(public auth: Auth, public userService: UserService) {}

  async loginUser(email: string, password: string) {
    //   try {
    //     const signInResult = await signInWithEmailAndPassword(this.auth, email, password);
    //     return signInResult.user !== null;
    // } catch (error: any) {
    //     if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
    //         return false;
    //     } else {
    //         throw error;
    //     }
    // }
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  guestLogin() {
    return signInAnonymously(this.auth);
  }

  async updateUserProfile(data: {
    displayName?: string;
    email?: string;
  }): Promise<void> {
    const user = this.auth.currentUser;

    if (data.displayName) {
      await updateProfile(user!, { displayName: data.displayName });
      // console.log('User profile updated successfully!', user?.displayName);
    }

    if (data.email && user?.email !== data.email) {
      try {
        await verifyBeforeUpdateEmail(user!, data.email);
        // console.log('Verification email sent for new email address.');
      } catch (error: unknown) {
        console.error('Error sending verification email:', error);
      }
    }

    if (data.displayName || (data.email && user?.email !== data.email)) {
      try {
        const firestoreUser: User = {
          id: this.userService.currentUser.id || '',
          name: user?.displayName || '',
          email: data.email || '',
          password: '',
          logged_in: this.userService.currentUser.logged_in || false,
          is_typing: this.userService.currentUser.is_typing || false,
          profile_img: this.userService.currentUser.profile_img || '',
          last_channel: this.userService.currentUser.last_channel || '',
          last_thread: this.userService.currentUser.last_thread || '',
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
              last_thread: this.last_thread,
            };
          },
        };
        this.userService.updateUser(firestoreUser);
        // console.log('Firestore user updated successfully', firestoreUser);
      } catch (error: unknown) {
        console.error('Error updating Firestore user:', error);
      }
    }
  }

  async currentUser() {
    return this.auth.currentUser;
  }

  logout() {
    // if (typeof localStorage !== 'undefined' && localStorage.getItem('currentUser') !== null) {
    //   localStorage.removeItem('currentUser');
    // }
    return signOut(this.auth);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(this.auth, provider)
      .then((result) => {
        var user = result.user;
        this.googleName = user.displayName;
        this.googleEmail = user.email;
        this.googleProfileImg = user.photoURL;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async saveUser(name: string): Promise<void> {
    const user_auth: any = this.auth.currentUser;
    if (user_auth) {
      try {
        await updateProfile(user_auth, { displayName: name });
        this.displayName = user_auth.displayName;
      } catch (error) {
        console.error('Fehler bei updateDoc', error);
      }
    } else {
      console.error('Benutzer ist nicht authentifiziert');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Error sending password reset email', error);
    }
  }

  changePassword(newPassword: string) {
    const user_auth: any = this.auth.currentUser;
    if (user_auth) {
      updatePassword(user_auth, newPassword)
        .then(() => {
          // console.log('Password updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating password:', error);
        });
    }
  }

  async registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async checkEmailExistence(email: string) {
    return fetchSignInMethodsForEmail(this.auth, email);
  }

  checkAuth() {
    return new Promise<boolean>(async (resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  checkAuthLoggedInAsGuest() {
    return new Promise<boolean>((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // check, ob der Benutzer anonym angemeldet ist
          const isAnonymous = user.isAnonymous;
          resolve(isAnonymous);
        } else {
          resolve(false);
        }
      });
    });
  }
}
