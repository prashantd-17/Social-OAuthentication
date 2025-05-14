import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private clientId = '100465429990-t0gtmrues8c89gr844poea5m5ej06epl.apps.googleusercontent.com';

  constructor() {}

  initialize(callback: (credential: string) => void): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        callback(response.credential); // ID token
      }
    });

    google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      { theme: 'outline', size: 'large' }
    );
  }

  prompt(): void {
    google.accounts.id.prompt(); // Optional
  }
}
