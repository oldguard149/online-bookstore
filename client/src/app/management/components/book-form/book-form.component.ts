import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IGenre, IPublisher, IAuthor } from 'src/app/shared/interfaces/interfaces';
import { FlashMessageService } from 'src/app/shared/services/flash-message.service';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'book-form',
  templateUrl: './book-form.component.html',
  styleUrls: [ '../../style/mform.scss'],
  host: {
    class: 'm-form'
  }
})
export class BookFormComponent implements OnInit {
  form: FormGroup;
  displayButton: string;
  onSubmit: any;
  genres: IGenre;
  publishers: IPublisher;
  @Output() sendMessage: EventEmitter<any> = new EventEmitter<any>();
  @Input() type: 'update' | 'create';
  @Input('book') bookInforForUpdate: IBook;
  private subs = new SubSink();
  constructor(
    private fb: FormBuilder,
    private flash: FlashMessageService,
    private router: Router,
    private management: ManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      isbn: ['', Validators.required],
      name: ['', Validators.required],
      image_url: ['', Validators.required],
      summary: [''],
      author: [''],
      genre_id: [''],
      publisher_id: ['']
    });

    this.initializeFormForUpdate();
    this.subs.sink = this.management.genresAndPublishers().subscribe(data => {
      this.genres = data.genres;
      this.publishers = data.publishers;
    })

    if (this.type === 'create') {
      this.onSubmit = this.createBook;
      this.displayButton = 'Thêm';
    } else {
      this.onSubmit = this.updateBook;
      this.displayButton = 'Cập nhật';
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initializeFormForUpdate() {
    if (this.bookInforForUpdate) {
      const book = this.bookInforForUpdate;
      this.form.patchValue({
        isbn: book.isbn,
        name: book.name,
        image_url: book.image_url,
        summary: book.summary ? book.summary : '',
        author: this.convertAuthorsFromArrayToString(book),
        genre_id: book.Genre.genre_id,
        publisher_id: book.Publisher.publisher_id
      });
    }
  }

  createBook() {
    if (this.form.valid) {
      const book = this.form.value;
      this.subs.sink = this.management.create('book', book)
        .subscribe(data => {
          if (data.success) {
            this.triggerSendMessageEvent('success', data.message);
            this.form.reset();
          } else {
            this.triggerSendMessageEvent('fail', data.message);
          }
        });      
    }
  }

  updateBook() {
    if (this.form.valid) {
      const isbn = this.route.snapshot.params['isbn'];
      const book = this.form.value;
      this.subs.sink = this.management.update('book', isbn, book)
        .subscribe(data => {
          if (data.success) {
            this.flash.setMessage('success', data.message[0]);
            this.router.navigateByUrl('/management/search/book');
          } else {
            this.triggerSendMessageEvent('fail', data.message);
          }
        })
    }
  } // end of updateBook

  triggerSendMessageEvent(type: 'success' | 'fail', message: string[]) {
    this.sendMessage.emit({ type: type, message: message });
  }

  convertAuthorsFromArrayToString(book: IBook) {
    return book.Authors.map(author  => author.fullname).join(', ')
  }

  get formControls() {
    return this.form.controls;
  }

}
