import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MustMatch } from './checkMatchPassword';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss'],
  host: {
    class: 'auth-main'
  }
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMsg: string[];
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private flash: FlashMessageService
  ) { }

  ngOnInit(): void {
    // this.registerForm = this.fb.group({
    //   name: ['tran', [Validators.required]],
    //   email: ['thuan', [Validators.required, Validators.email]],
    //   password: ['as', [Validators.required]],
    //   confirmPassword: ['as', Validators.required],
    //   phoneNumber: ['099'],
    //   address: ['an giang']
    // }, { validator: MustMatch('password', 'confirmPassword') });
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
      phoneNumber: [''],
      address: ['']
    }, { validator: MustMatch('password', 'confirmPassword') });
  }

  onSubmit() {
    this.auth.register(this.registerForm.value).toPromise()
      .then(data => {
        if (data.success) {
          this.flash.setMessage('success', 'Register successfully');
          this.router.navigateByUrl('/login');
        } else {
          this.errorMsg = data.message;
        }
      });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
