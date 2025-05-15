import { Injectable } from '@angular/core';

declare const FB:any;

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}


@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {

  private appId:string = '706713732013888'
  
  constructor() {
    this.loadFacebookSDK();
  }

  private loadFacebookSDK(): void {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: this.appId,
        cookie: true,
        xfbml: false,
        version: 'v18.0' // Use latest available version
      });
    };

    // Inject SDK script into DOM
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.body.appendChild(script);
  }

  login(callback: (accessToken: string, profile: any) => void): void {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        // Get user info
        window.FB.api('/me', { fields: 'name,email,picture' }, (profile: any) => {
          callback(response.authResponse.accessToken, profile);
        });
      } else {
        console.warn('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email,public_profile' });
  }

  logout(): void {
    window.FB.logout();
  }
}
