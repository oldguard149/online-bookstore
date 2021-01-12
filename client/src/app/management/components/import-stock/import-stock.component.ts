import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-import-stock',
  templateUrl: './import-stock.component.html',
  styleUrls: ['./import-stock.component.scss']
})
export class ImportStockComponent implements OnInit {
  form: FormGroup;
  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      publisher: ['', Validators.required],
      stocks: this._fb.array([
        this._fb.group({
          isbn: ['', Validators.required],
          quantity: ['', Validators.required],
          price: ['', Validators.required]
        })
      ])
    });
  }


  get stocks() {
    return this.form.get('stocks') as FormArray;
  }

  addRow() {
    this.stocks.push(this._fb.group({
      isbn: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required]
    }));
  }

  removeRow(i: number) {
    this.stocks.removeAt(i);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
