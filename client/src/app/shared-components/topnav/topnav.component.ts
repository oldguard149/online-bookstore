import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Component({
  selector: 'topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {

  constructor(
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isCustomer(): boolean {
    return this.auth.isCustomer();
  }

  canDoManagement(): boolean {
    return !this.auth.isCustomer();
  }
}
