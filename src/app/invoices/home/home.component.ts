
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, tap, Subscription, concatMap, of } from 'rxjs';
import { InvoicesStore } from '../../services/invoices.store';
import { LoadingService } from '../../shared/loading/loading.service';

import { animations } from 'src/app/utils/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [LoadingService],
  animations,
})
export class HomeComponent implements OnInit, OnDestroy {
  invoices$ = this.invoiceStore.filteredInvoices$;
  isLoading$ = this.loadingService.loading$;
  private queryParamSubscription = new Subscription();
  private refreshSub = new Subscription();

  constructor(
    private invoiceStore: InvoicesStore,
    public loadingService: LoadingService,
  ) {}

  ngOnDestroy(): void {
    this.queryParamSubscription.unsubscribe();
    this.refreshSub.unsubscribe();
  }
  ngOnInit(): void {
    this.refreshSub = this.invoiceStore.apiInvoicesRefreshing$
      .pipe(
        concatMap((refreshing) => {
          if (refreshing) {
            return this.getFilterInvoices();
          } else {
            return of(null);
          }
        })
      )
      .subscribe();

    this.queryParamSubscription = this.getFilterInvoices().subscribe();
  }

  getFilterInvoices() {

        return this.loadingService
          .showLoaderUntilCompleted(this.invoiceStore.loadingInvoices())
          .pipe(
            tap((invoices) => {
              this.invoiceStore.filterInvoices(invoices);
            })
          );
  }
}
