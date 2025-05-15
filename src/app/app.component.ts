import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthService } from '../google-auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FacebookAuthService } from '../facebook-auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  constructor(private googleAuth: GoogleAuthService, private fbAuth: FacebookAuthService, private http: HttpClient) {}

  userInfo: any = null;

  ngAfterViewInit(): void {
    this.googleAuth.initialize((idToken: string) => {
      this.http.post('http://localhost:5000/auth/google', { idToken })
        .subscribe({
          next: (res) => {
            this.userInfo = res;
          },
          error: (err) => {
            console.error('Login failed:', err);
          }
        });
    });
  }

  loginWithFacebook(): void {
    this.fbAuth.login((accessToken: string) => {
      this.http.post('http://localhost:5000/auth/facebook', { accessToken }).subscribe({
        next: (res) => console.log('User info:', res),
        error: (err) => console.error('Login failed:', err),
      });
    });
  }


// FB.getLoginStatus(function(response) {
//   statusChangeCallback(response);
// });
  
}
