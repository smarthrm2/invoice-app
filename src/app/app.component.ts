import { InvoicesStore } from './services/invoices.store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { animations } from './utils/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations,
})
export class AppComponent implements OnInit {
  bp$!: Observable<string>;
  sideNavOpened$ = this.invoicesStore.sideNavOpened$;

  constructor(
    private invoicesStore: InvoicesStore
  ) {}

  ngOnInit(): void {

  }

  
}
