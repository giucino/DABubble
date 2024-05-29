import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  confirmPasswordReset,
  getAuth,
  sendPasswordResetEmail,
  signInWithPopup,
  verifyPasswordResetCode,
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
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  firestore: Firestore = inject(Firestore);
  displayName: string = '';
  googleName: any = '';
  googleEmail: any = '';
  googleProfileImg: any = '';

  constructor(public auth: Auth, public userService: UserService, private route: ActivatedRoute) { }

  async loginUser(email: string, password: string) {
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

    const firestoreUser: User = {
      id: this.userService.currentUser.id || '',
      name: data.displayName || user?.displayName || '',
      email: user?.email || '',  // Initial setzen auf aktuelle E-Mail
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

    if (data.displayName) {
      await updateProfile(user!, { displayName: data.displayName });
      // console.log('User profile updated successfully!', user?.displayName);
    }

    if (data.email && user?.email !== data.email) {
      try {
        await verifyBeforeUpdateEmail(user!, data.email);
        console.log('Verification email sent for new email address.');

        // firestoreUser.email = data.email;
      } catch (error) {
        console.error('Error sending verification email:', error);
        return;
      }
    }

    try {
      await this.userService.updateUser(firestoreUser);
      localStorage.setItem('currentUser', JSON.stringify(firestoreUser));
      console.log('Firestore user updated successfully', firestoreUser);
    } catch (error) {
      console.error('Error updating Firestore user:', error);
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



  async changePassword(newPassword: string, oobCode: string) {
    try {
      const auth = getAuth();
      const email = await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, newPassword);
      // console.log(`Password has been reset for ${email}`);
    } catch (error) {
      console.error('Error updating password', error);
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
