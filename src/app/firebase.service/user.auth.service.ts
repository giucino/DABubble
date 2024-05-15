import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, sendPasswordResetEmail, signInWithPopup, updatePassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, fetchSignInMethodsForEmail, signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  firestore: Firestore = inject(Firestore);
  displayName: string = '';
  googleName: any = '';
  googleEmail: any = '';
  googleProfileImg: any = '';
  googleId: any = '';


  constructor(public auth: Auth) {
  }


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

  currentUser() {
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

    return signInWithPopup(this.auth, provider).then((result) => {
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
      updatePassword(user_auth, newPassword).then(() => {
        // console.log('Password updated successfully!');
      }).catch((error) => {
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



