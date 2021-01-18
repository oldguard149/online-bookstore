import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SubSink } from 'subsink';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';
import { LocalCartService } from 'src/app/main/services/local-cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: 'auth-main'
  }
})
export class LoginComponent implements OnInit {
  private subs = new SubSink();
  loginForm: FormGroup;
  errorMsg: string[];
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private flash: FlashMessageService,
    private localCart: LocalCartService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [, [Validators.required, Validators.email]],
      password: [, [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.flash.initialize();
  }

  onSubmit() {
    this.subs.sink = this.auth.login(this.loginForm.value)
      .subscribe(data => {
        if (data.success) {

          // if (this.auth.isCustomer()) {
          //   this.localCart.syncLocalCartWithServerCart().subscribe
          //     (data => {
          //       console.log(data.message[0]);
          //       // this.localCart.clearLocalCart();
          //     })
          // }

          this.router.navigateByUrl('/');
        } else {
          this.errorMsg = data.message;
        }
      });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


}
