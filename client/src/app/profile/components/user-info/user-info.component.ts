import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { SubSink } from 'subsink';

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
      this.subs.sink = this._profile.getCustomerInfo().subscribe(data => {
        if (data.success) {
          this.form = this._fb.group({
            email: [data.customer.email, Validators.required],
            fullname: [data.customer.fullname, Validators.required],
            phoneNumber: [data.customer.phone_number, Validators.required],
            address: [data.customer.address]
          });
        }
      });
    } else {
      const user = this._auth.getUserDetail()
      this.subs.sink = this._profile.getEmpInfo(user.id).subscribe(data => {
        this.form = this._fb.group({
          email: [data.employee.email],
          fullname: [data.employee.fullname, Validators.required],
          phoneNumber: [data.employee.phone_number, Validators.required],
          identityNumber: [data.employee.identity_number, Validators.required]
        })
      });
    }
  }

  onSubmit(): void {
    if (this.isCustomer()) {
      if (this.form.valid) {
        this.subs.sink = this._profile.updateCustomerInfo(this.form.value).subscribe(data => {
          data.success ? this.successMsg = data.message : this.errorMsg = data.message;
        });
      }
    } else {
      if (this.form.valid) {
        const user = this._auth.getUserDetail()
        this.subs.sink = this._profile.updateEmpInfo(user.id, this.form.value).subscribe(data => {
          data.success ? this.successMsg = data.message : this.errorMsg = data.message;
        });
      }
    }
  }

  isCustomer(): boolean {
    return this._auth.isCustomer();
  }

}


