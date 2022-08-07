import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, } from '@app/_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public set currentUserValue(editedUser: User) {
    //console.dir(editedUser);
    console.log(editedUser.tzNumber);
    console.log(editedUser.address.city);
    console.log(editedUser.address.street);
    console.log(editedUser.address.house);
    console.log(editedUser.address.zip
    );

    debugger
    this.http.put<any>(`${environment.apiUrl}/users/update`, {
      TzNumber: editedUser.tzNumber,
      City: editedUser.address.city,
      Street: editedUser.address.street,
      House: editedUser.address.house,
      Zip: editedUser.address.zip
    })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })).
      subscribe({
        next: data => { console.log('updated') },
        error: error => {
          console.error('There was an error!', error);
        }
      });
    //this.currentUserSubject.next(editedUser);
  }

  login(tzNumber: number) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { tzNumber })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
