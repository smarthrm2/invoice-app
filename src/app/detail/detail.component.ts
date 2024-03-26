import { animations } from 'src/app/utils/animations';
import { InvoicesStore } from 'src/app/services/invoices.store';
import { NavigationService } from './../services/navigation.service';
import { LoadingService } from './../shared/loading/loading.service';
import { InvoiceService } from './../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from 'src/app/utils/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  Observable,
  combineLatest,
  Subscription,
  filter,
  concatMap,
  of,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { openConfirmDialog } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [LoadingService],
  animations,
})
export class DetailComponent implements OnInit, OnDestroy {
  $bp!: Observable<string>;
  invoice!: Invoice;
  isLoading$ = this.loadingService.loading$;
  sub = new Subscription();
  refreshApiSub = new Subscription();

  constructor(
    private route: ActivatedRoute,

    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private invoicesStore: InvoicesStore,
    private loadingService: LoadingService,
    private navigationService: NavigationService
  ) {}
  ngOnDestroy(): void {
    this.refreshApiSub.unsubscribe();
  }

  ngOnInit(): void {
    this.invoice = this.route.snapshot.data['invoice'];
    this.refreshApiSub = this.invoicesStore.apiInvoiceRefreshing$
      .pipe(
        concatMap((refreshing) => {
          if (refreshing) {
            return this.invoiceService.getInvoice(this.invoice.id);
          }
          return of(null);
        })
      )
      .subscribe((invoice) => {
        if (invoice) {
          this.invoice = invoice;
        }
      });
  }

}
