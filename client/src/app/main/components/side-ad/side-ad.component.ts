import { Component, OnInit } from '@angular/core';
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
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getSideAdBooklist().then(data => {
      this.sideAdBooklist = data.booklist
    });
  }

}
