import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  public isOwnProfile: boolean = false;
  private viewingUserId: string | null = null;

  constructor() {}

  setOwnProfileStatus(status: boolean): void {
    this.isOwnProfile = status;
  }

  getOwnProfileStatus(): boolean {
    return this.isOwnProfile;
  }

  setViewingUserId(userId: string | null): void {
    this.viewingUserId = userId;
  }

  getViewingUserId(): string | null {
    return this.viewingUserId;
  }
}
