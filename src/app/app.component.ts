import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'realtime-chat-firebase';
  constructor(
    private angularFireMessaging: AngularFireMessaging
  ) {

  }
  ngOnInit(): void {
    this.angularFireMessaging.requestPermission
      .pipe(take(1))
      .subscribe(
        () => {
          console.log('Permission granted');
          this.angularFireMessaging.getToken
            .subscribe(
              (token) => {
                console.log('Token:', token);
                // Send this token to your server to associate it with the user
              },
              (error) => {
                console.error('Error getting token:', error);
              }
            );
        },
        (error) => {
          console.error('Permission denied:', error);
        }
      );
  }

}
