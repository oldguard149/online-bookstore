import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  genres // = [
  //   { "genre_id": 1, "name": "Công Nghệ Thông Tin", "bookcount": 18 },
  //   { "genre_id": 4, "name": "Văn Học", "bookcount": 9 },
  //   { "genre_id": 3, "name": "Kinh Tế", "bookcount": 4 },
  //   { "genre_id": 2, "name": "Ngoại Ngữ", "bookcount": 2 },
  //   { "genre_id": 5, "name": "Du Lịch", "bookcount": 0 }
  // ];
  publishers // = [
  //   { "publisher_id": 4, "name": "Apress Media LLC", "bookcount": 4 },
  //   { "publisher_id": 2, "name": "O'Reilly Media", "bookcount": 4 },
  //   { "publisher_id": 7, "name": "HarperCollins Publishers", "bookcount": 3 },
  //   { "publisher_id": 12, "name": "The MIT Press", "bookcount": 3 },
  //   { "publisher_id": 10, "name": "Scribner", "bookcount": 3 }
  // ];
  authors //= [
  //   { "author_id": 22, "fullname": "Ernest Hemingway", "bookcount": 3 },
  //   { "author_id": 17, "fullname": "J.R.R. Tolkien", "bookcount": 2 },
  //   { "author_id": 37, "fullname": "Svetlozar T. Rachev", "bookcount": 2 },
  //   { "author_id": 39, "fullname": "Frank J. Fabozzi", "bookcount": 2 },
  //   { "author_id": 27, "fullname": "Aaron Courville", "bookcount": 1 }
  // ];
  
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getSidenav().then(data => {
      this.genres = data.genres;
      this.publishers = data.publishers;
      this.authors = data.authors;
    })
  }

}
