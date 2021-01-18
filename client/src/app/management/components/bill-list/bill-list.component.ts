import { Component, OnInit } from '@angular/core';
import { ManagementService } from '../../services/management.service';
import { SubSink } from 'subsink';
import { ActivatedRoute, Router } from '@angular/router';
import { apiurl } from 'src/app/shared/api-url';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { param } from 'express-validator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'management-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
  host: {
    class: 'management-main'
  }
})
export class BillListComponent implements OnInit {
  private subs = new SubSink();
  private validSearchType = new Set(['all', 'unconfirmed', 'confirmed', 'canceled']);
  billStatusType = [
    { type: 'confirmed', displayName: 'Đã xác nhận' },
    { type: 'unconfirmed', displayName: 'Chờ xác nhận' },
    { type: 'all', displayName: 'Tất cả' },
    { type: 'canceled', displayName: 'Đã hủy' }
  ]
  displayedColumns = ['id', 'createdate', 'state', 'totalamount', 'option'];
  errorMsg: string[];
  form: FormGroup;
  bills: any;
  totalItems: number;
  pageSize: number = 10;
  currentPage: number = 0;
  searchType: any = 'all';
  constructor(
    private _management: ManagementService,
    private _router: Router,
    private _fb: FormBuilder,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      statusType: ['all', Validators.required],
      pageSize: ['10', Validators.required]
    })
    this.fetchBills();
  }

  fetchBills() {
    this.subs.sink = this._route.queryParams.subscribe(params => {
      this.validSearchType.has(params['type']) ? this.searchType = params['type'] : this.searchType = 'all';
      this.currentPage = this.getValidPaginationNumber(params['page'], 0);
      this.pageSize = this.getValidPaginationNumber(params['pagesize'], 10);

      this.form.patchValue({
        statusType: this.searchType,
        pageSize: this.pageSize
      });

      this.subs.sink = this._management.billList(this.searchType, this.currentPage, this.pageSize).subscribe(data => {
        if (data.success) {
          this.bills = data.bills;
        } else {
          this.errorMsg = data.message;
        }
      })
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSubmit() {
    this._router.navigate([], {
      queryParams: {
        type: this.formType.value,
        page: this.currentPage,
        pagesize: this.formPageSize.value
      },
      queryParamsHandling: 'merge'
    })
  }
  manageBill(id: string) {
    this._router.navigateByUrl(`/management/bill/${id}`);
  }

  handlePageChange(page: PageEvent) {
    this._router.navigate([], {
      queryParams: {
        'page': page.pageIndex,
        'pagesize': page.pageSize
      },
      queryParamsHandling: 'merge'
    });
  }

  get formType() { return this.form.get('statusType') }
  get formPageSize() { return this.form.get('pageSize') }
  getValidPaginationNumber(checkValue: any, defaultValue: number): number {
    if (isNaN(checkValue) || Number(checkValue) < 0) {
      return defaultValue;
    }
    return parseInt(checkValue);
  }
}
