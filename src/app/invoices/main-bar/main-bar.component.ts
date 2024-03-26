import { Status, StatusParams } from '../../utils/interfaces';
import { InvoicesStore } from '../../services/invoices.store';
import { Invoice } from '../../utils/interfaces';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { modifyQueryParams } from 'src/app/utils';
import { openCustomDialog } from 'src/app/detail/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main-bar',
  templateUrl: './main-bar.component.html',
  styleUrls: ['./main-bar.component.scss'],
})
export class MainBarComponent implements OnInit {
  bp$!: Observable<string>;
  invoices$!: Observable<Invoice[]>;

  statuses: Status[] = ['Partial', 'Paid', 'Pending'];

  statusFormGroup = this._formBuilder.group({
    partial: false,
    pending: false,
    paid: false,
  });

  getNumOfInvoicesMsg(invoices: Invoice[]) {
    if (invoices.length < 1) {
      return '';
    } else if (invoices.length === 1) {
      return `There is ${invoices.length} total invoice`;
    }
    return `There are ${invoices.length} total invoices`;
  }

  getNumOfInvoicesMsgMobile(invoices: Invoice[]) {
    if (invoices.length < 1) {
      return 'No Invoices';
    } else if (invoices.length === 1) {
      return `${invoices.length} invoice`;
    }
    return `${invoices.length} invoices`;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private invoicesStore: InvoicesStore,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.invoices$ = this.invoicesStore.filteredInvoices$;

    modifyQueryParams(this.route.queryParams)
      .pipe(
        tap((params) => {
          if (Object.entries(params).length) {
            this.statusFormGroup.setValue({ ...params });
          }
        })
      )
      .subscribe();
    this.statusFormGroup.valueChanges
      .pipe(
        tap((formData: Partial<StatusParams>) => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: formData,
            queryParamsHandling: 'merge',
          });
        })
      )
      .subscribe();
  }

  onNewInvoiceClick() {
    this.invoicesStore.addInvoice();
  openCustomDialog(this.dialog)
  .subscribe(() => {
    this.invoicesStore.refreshInvoicesApi();
  });
  }

  
}
