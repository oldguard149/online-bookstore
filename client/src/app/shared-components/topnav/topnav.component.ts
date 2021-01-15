import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Component({
  selector: 'topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
  form: FormGroup;
  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      search: ['', Validators.required]
    })
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isCustomer(): boolean {
    return this.auth.isCustomer();
  }

  canDoManagement(): boolean {
    if (this.isLoggedIn()) {
      const user = this.auth.getUserDetail();
      return user.role === 'EMP' || user.role === 'ADMIN';
    } else {
      return false;
    }
  }

  canAccessCart(): boolean {
    return !this.auth.isEmp();
  }

  logout(): void {
    this.auth.logout();
  }

  search() {
    this.router.navigate(['/search'], {
      queryParams: {
        search: this.searchText.value,
        page: 0,
        pagesize: 10,
        type: 'book'
      },
      queryParamsHandling: 'merge'
    })
  }

  get searchText() {
    return this.form.get('search')
  }
}
