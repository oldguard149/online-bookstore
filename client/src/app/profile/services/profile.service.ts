import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { apiurl } from 'src/app/shared/api-url';

interface ICustomerResponse {
  success: boolean,
  customer: {
    customer_id: number,
    fullname: string,
    email: string,
    phone_number: string,
    address: string
  }
}

interface IEmployeeResponse {
  success: boolean,
  employee: {
    emp_id: number,
    fullname: string,
    email: string,
    identity_number: string,
    phone_number: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private _http: HttpClient,
    private _auth: AuthenticationService
  ) { }

  getProfileData(): any {
    return this._http.get(`${apiurl}/profile`);
  }

  updateCustomerProfile(customer) {
    return this._http.put<any>(`${apiurl}/profile/customer`, customer);
  }

  updateEmpProfile(emp) {
    return this._http.put<any>(`${apiurl}/profile/employee/`, emp);
  }

  updatePassword(password) {
    return this._http.post<any>(`${apiurl}/update-password`, password);
  }

  getBillListForCustomer() {
    if (this._auth.isCustomer()) {
      return this._http.get<any>(`${apiurl}/bills`);
    }
  }

  getBillDetailForCustomer(billId: string) {
    if (this._auth.isCustomer()) {
      return this._http.get<any>(`${apiurl}/bill/${billId}`);
    }
  }

}
