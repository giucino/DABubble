import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public isOwnProfile: boolean = false;

  constructor() {}

  setOwnProfileStatus(status: boolean) {
    this.isOwnProfile = status;
  }

  getOwnProfileStatus(): boolean {
    return this.isOwnProfile;
  }
}
