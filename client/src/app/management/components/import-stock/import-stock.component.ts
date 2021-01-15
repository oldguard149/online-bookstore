import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagementService } from '../../services/management.service';

@Component({
  selector: 'app-import-stock',
  templateUrl: './import-stock.component.html',
  styleUrls: ['./import-stock.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class ImportStockComponent implements OnInit {
  form: FormGroup;
  errorMsg: string[];
  successMsg: string[];
  constructor(
    private _fb: FormBuilder,
    private _management: ManagementService
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
    this._management.importStock(this.form.value).subscribe(data => {
      if (data.success) {
        this.successMsg = data.message;
        this.form.reset();
      } else {
        this.errorMsg = data.message;
      }
    })
  }
}
