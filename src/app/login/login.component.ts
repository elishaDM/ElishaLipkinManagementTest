import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services/authentication.service';
import { UserService } from '../_services/user.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  error = '';
  tzInput = '';
  tzList: number[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['user-details']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      tzNumber: ['', [Validators.required, this.forbiddenTzValidator()]]
    });
    this.userService.getAllTz().subscribe(
      tzList => { this.tzList = tzList });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    //console.log(this.isIsraeliIdNumber(this.f.tzNumber.value));
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      //console.log("The form is Invalid")
      return;
    }
    //console.log("The form is VALID")
    this.loading = true;
    this.authenticationService.login(this.f.tzNumber.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from route parameters or default to '/'
          //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate(['user-details']);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  forbiddenTzValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = !this.isIsraeliIdNumber(control.value);
      //console.log("try validate")
      return forbidden ? { forbiddenTz: { value: control.value } } : null;
    };
  }

  isIsraeliIdNumber(id) {
    id = String(id).trim();
    if (id.length > 9 || isNaN(id)) return false;
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
    return Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;
  }
}
