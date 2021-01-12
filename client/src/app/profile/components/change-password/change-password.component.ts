import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { SubSink } from 'subsink';
import { MustMatch } from 'src/app/authentication/components/register/checkMatchPassword';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  host: {
    class: 'profile-main'
  }
})
export class ChangePasswordComponent implements OnInit {
  errorMsg: string[];
  successMsg: string[];
  form: FormGroup;
  private subs = new SubSink();
  constructor(
    private _profile: ProfileService,
    private _auth: AuthenticationService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, {validator: MustMatch('new_password', 'confirm_password')});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit(): void {
    this.subs.sink = this._profile.updatePassword(this.form.value).subscribe(data => {
      data.success ? this.successMsg = data.message : this.errorMsg = data.message;
    });
  }
}
