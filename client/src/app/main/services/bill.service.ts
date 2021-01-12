import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiurl } from 'src/app/shared/api-url';

interface ICustomerReponse {
  success: boolean,
  customer: {
    customer_id: number,
    fullname: string,
    email: string,
    phone_number: string,
    address: string
  }
}

@Injectable()
export class BillService {

  constructor(
    private http: HttpClient
  ) { }

  getCustomerInfo() {
    return this.http.get<any>(`${apiurl}/profile`);
  }

  createBill() {
    return this.http.get<any>(`${apiurl}/create-bill`);
  }
}
