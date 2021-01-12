import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      this.subs.sink = this._profile.getProfileData().subscribe(data => {
        if (data.success) {
          this.form = this._fb.group({
            email: [data.user.email, Validators.required],
            fullname: [data.user.fullname, Validators.required],
            phoneNumber: [data.user.phone_number, Validators.required],
            address: [data.user.address]
          }); 
        }
      });
    } else {
      this.subs.sink = this._profile.getProfileData().subscribe(data => {
        this.form = this._fb.group({
          email: [data.user.email],
          fullname: [data.user.fullname, Validators.required],
          phoneNumber: [data.user.phone_number, Validators.required],
          identityNumber: [data.user.identity_number, Validators.required]
        });
      });
    }
  }

  onSubmit(): void {
    console.log(this.form.value);
    
    // if (this.form.valid) {
    //   if (this.isCustomer()) {
    //     this.subs.sink = this._profile.updateCustomerProfile(this.form.value).subscribe(data => {
    //       data.success ? this.successMsg = data.message : this.errorMsg = data.message;
    //     });
    //   } else {
    //     this.subs.sink = this._profile.updateEmpProfile(this.form.value).subscribe(data => {
    //       data.success ? this.successMsg = data.message : this.errorMsg = data.message;
    //     });
    //   }
    // }
  }

  isCustomer(): boolean {
    return this._auth.isCustomer();
  }

}


