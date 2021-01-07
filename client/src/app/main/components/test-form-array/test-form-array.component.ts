import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test-form-array',
  templateUrl: './test-form-array.component.html',
  styleUrls: ['./test-form-array.component.scss']
})
export class TestFormArrayComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          isbn: ['isbn1'], price: ['0'], quantity: ['']
        }),
        this.fb.group({
          isbn: ['isbn1'], price: ['0'], quantity: ['']
        })
      ])
    });
  }

  showValue() {
    console.log(this.form.value);
  }

  addField() {
    this.formArray.push(this.fb.group({
      isbn: ['isbn1'], price: ['0'], quantity: ['']
    }));
  }

  removeRow(i: number) {
    this.formArray.removeAt(i);
  }

  get formArray() {
    return this.form.get('formArray') as FormArray;
  }

}
