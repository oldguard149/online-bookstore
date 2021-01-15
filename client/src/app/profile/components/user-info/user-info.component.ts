import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { SubSink } from 'subsink';
import { load } from 'dotenv/types';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  host: {
    class: 'profile-main'
  }
})
export class UserInfoComponent implements OnInit {
  form: FormGroup;
  errorMsg: string[];
  successMsg: string[];
  private subs = new SubSink();
  constructor(
    private _auth: AuthenticationService,
    private _fb: FormBuilder,
    private _profile: ProfileService
  ) { }

  ngOnInit(): void {
    this.fecthFormData();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  fecthFormData(): void {
    if (this.isCustomer()) {
      this.subs.sink = this._profile.getProfileData().subscribe(data => {
        if (data.success) {
          this.form = this._fb.group({
            email: [data.user.email, Validators.required],
            fullname: [data.user.fullname, Validators.required],
            phoneNumber: [data.user.phone_number, [Validators.required, Validators.pattern(/^\d{10,15}$/i)]],
            address: [data.user.address]
          });
        }
      });
    } else {
      this.subs.sink = this._profile.getProfileData().subscribe(data => {
        this.form = this._fb.group({
          email: [data.user.email],
          fullname: [data.user.fullname, Validators.required],
          phoneNumber: [data.user.phone_number, [Validators.required, Validators.pattern(/^\d{10,15}$/i)]],
          identityNumber: [data.user.identity_number, [Validators.required, Validators.pattern(/^\d{9}$|^\d{12}$/)]]
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isCustomer()) {
        this.subs.sink = this._profile.updateCustomerProfile(this.form.value).subscribe(data => {
          data.success ? this.successMsg = data.message : this.errorMsg = data.message;
        });
      } else {
        this.subs.sink = this._profile.updateEmpProfile(this.form.value).subscribe(data => {
          data.success ? this.successMsg = data.message : this.errorMsg = data.message;
        });
      }
    }
  }

  isCustomer(): boolean {
    return this._auth.isCustomer();
  }

  get email() { return this.form.get('email') }
  get fullname() { return this.form.get('fullname') }
  get phoneNumber() { return this.form.get('phoneNumber') }
  get identityNumber() { return this.form.get('identityNumber') }
  get address() { return this.form.get('address') }

}


