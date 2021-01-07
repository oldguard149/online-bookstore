import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

@Injectable()
export class ProfileService {

  constructor(
    private _http: HttpClient
  ) { }

  getCustomerInfo() {
    return this._http.get<ICustomerResponse>(`${apiurl}/customer`);
  }

  getEmpInfo(id: number) {
    return this._http.get<IEmployeeResponse>(`${apiurl}/employee/${id}`);
  }

  updateCustomerInfo(customer): any {
    return this._http.put(`${apiurl}/customer`, customer);
  }

  updateEmpInfo(id: number, emp): any {
    return this._http.put(`${apiurl}/employee/${id}`, emp);
  }

  updatePassword(type: 'employee' | 'customer', password) {
    return this._http.put<any>(`${apiurl}/update-password/${type}`, password);
  }

}
