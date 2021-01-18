import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { DataService } from '../../services/data.service';

interface iSideAdBooklist {
  isbn: string,
  name: string,
  image_url: string
}

@Component({
  selector: 'side-ad',
  templateUrl: './side-ad.component.html',
  styleUrls: ['./side-ad.component.scss']
})
export class SideAdComponent implements OnInit {
  sideAdBooklist: iSideAdBooklist;
  constructor(
    private dataService: DataService,
    private _auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this._auth.isCustomer()) {
      this.dataService.getSideAdForCustomer().then(data => {
        this.sideAdBooklist = data.books;
        console.log(data.books);
        
      });
    } else {
      this.dataService.getSideAdForGuest().then(data => {
        this.sideAdBooklist = data.books;
      });
    }
  }

}
