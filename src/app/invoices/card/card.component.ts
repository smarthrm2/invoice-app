import { Component, Input, OnInit } from '@angular/core';
import { Item, Status } from '../../utils/interfaces';
import { openConfirmDialog, openCustomDialog } from 'src/app/detail/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from 'src/app/services/invoice.service';
import { InvoicesStore } from 'src/app/services/invoices.store';
import { EMPTY, catchError, concatMap, filter, tap } from 'rxjs';
import { UserTypeEnum } from 'src/app/shared/enum/user-type.enum';

interface CardData {
  id: string;
  invoiceDate: Date;
  paymentType: number;
  items: Item[];
  status: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() cardData: CardData | null = null;
  userType: string = "";
  UserTypeEnum = UserTypeEnum;
  constructor(private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private invoicesStore: InvoicesStore) { }
  ngOnInit(): void {

    /******For user role there is a temporary collection named users is set on firebase this feature could be enhanced by apply login and sign up feature and setting role but on assignment requirement now its just using a temporarly */
    this.invoiceService.getUserType('spgyg6doOge4u6WxXR5V').toPromise().then((user: any) => {
      this.userType = user?.userType;
    })

  }
  onEditClick(invoiceId: string) {
    this.invoiceService.getInvoice(invoiceId).subscribe(
      ((editInvoice) => {
        if (editInvoice) {
          this.invoicesStore.invoiceEditingSubject.next(editInvoice);
          openCustomDialog(this.dialog)
        }
      }),
      catchError(() => {
        return EMPTY;
      })
    );

  }
  onDeleteBtnClick(invoiceId) {
    openConfirmDialog(this.dialog, invoiceId)
      .pipe(
        filter((id) => !!id),
        concatMap((id) => this.invoiceService.deleteInvoice(id))
      )
      .subscribe(() => {
        this.invoicesStore.refreshInvoicesApi();
      });
  }
}
