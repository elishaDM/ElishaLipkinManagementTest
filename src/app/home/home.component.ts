import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models/user';
import { UserService } from '@app/_services/user.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  loading = false;
  users: number[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loading = false;
    //this.userService.getAllTz().pipe().subscribe(users => {
    //  this.loading = false;
    //  this.users = users;
    //});
  }
}
