import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-user.details',
  templateUrl: './user.details.component.html',
  styleUrls: ['./user.details.component.css'],
  animations: [
    trigger('editCollapsed', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class UserDetailsComponent implements OnInit {
  user: User;
  editForm: UntypedFormGroup;
  editCollapsed = true;
  error = '';
  editCity = '';
  editStreet = '';
  editHouse = 0;
  editZip = 0;

  constructor(private authenticationService: AuthenticationService, private formBuilder: UntypedFormBuilder,) { }

  ngOnInit(): void {
    this.authenticationService.currentUserSubject.subscribe(user => {
      this.user = user;
      this.editCity = this.user.address.city;
      this.editStreet = this.user.address.street;
      this.editHouse = this.user.address.house;
      this.editZip = this.user.address.zip;
    });
    this.editForm = this.formBuilder.group({
      editCity: [''],// [Validators.required]],
      editStreet: [''],//, [Validators.required]],
      editHouse: [0],// [Validators.required]],
      editZip: [0]// [Validators.required]]
    });
  }

  toggle() {
    this.editCollapsed = !this.editCollapsed;
  }

  onEdit() {
    this.editCollapsed = !this.editCollapsed;
  }

  onSubmitEdit() {
    if (this.editForm.invalid) {
      //console.log("The edit form is Invalid")
      return;
    }
    this.editCollapsed = true;
    debugger
    //console.log(this.editCity)
    this.authenticationService.currentUserValue = {
      ...this.user, address: { city: this.editCity, street: this.editStreet, house: this.editHouse, zip: this.editZip }
    }
  }
}
