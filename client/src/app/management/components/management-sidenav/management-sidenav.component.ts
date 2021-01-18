import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Component({
  selector: 'management-sidenav',
  templateUrl: './management-sidenav.component.html',
  styleUrls: ['./management-sidenav.component.scss']
})
export class ManagementSidenavComponent implements OnInit {

  constructor(
    private _auth: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  isAdmin() {
    return this._auth.isAdmin();
  }

}
