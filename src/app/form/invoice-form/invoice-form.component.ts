import { SortcharsPipe } from './../../shared/pipes/sortchars.pipe';
import { InvoicesStore } from './../../services/invoices.store';
import { InvoiceService } from './../../services/invoice.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';

import {
  CapVal,
  Invoice,
  Item,
  ItemListForm,
  Status,
} from 'src/app/utils/interfaces';
import { StatusTypes } from 'src/app/utils';
import { MatDialog } from '@angular/material/dialog';

interface MiscInfoForm {
  invoiceDate: Date;
  paymentType: number;
  paymentStatus:string;
}

interface GroupForm {
  itemListForm: ItemListForm;
  miscInfoForm: MiscInfoForm;
}

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
  providers: [SortcharsPipe],
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  bp$!: Observable<string>;
  sub = new Subscription();
  invoiceBeingEditedSub = new Subscription();
  errors: string[] = [];
  resetSubject: Subject<boolean> = new Subject();
  reset$: Observable<boolean> = this.resetSubject.asObservable();
  currentEditedInvoice: null | Invoice = null;
  headerTxt = 'New Invoice';

  @ViewChild('invoiceForm')
  invoiceFormElm!: ElementRef<HTMLDivElement>;

  @ViewChild('buttons')
  buttonsElm!: ElementRef<HTMLDivElement>;

  form = this.fb.group<GroupForm>({

    miscInfoForm: {
      invoiceDate: new Date(),
      paymentType: 1,
      paymentStatus:'Paid'
    },
    itemListForm: {
      cap_values: [
        {
          itemName: '',
          price: 0,
          qty: 1,
        },
      ],
    },
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private invoiceService: InvoiceService,
    private invoicesStore: InvoicesStore,
    private sortCharsPipe: SortcharsPipe,
    private renderer2: Renderer2,
    private matDialoug :MatDialog
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.invoiceBeingEditedSub.unsubscribe();
    document.body.style.overflow = '';
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    this.invoiceBeingEditedSub =
      this.invoicesStore.invoiceBeingEdited$.subscribe((invoice) => {
        this.currentEditedInvoice = invoice;
        if (invoice) {
          this.headerTxt = this.sortCharsPipe.transform(invoice.id);
          this.form.patchValue(this.applyDefaultData(invoice));
        } else {
          this.headerTxt = 'New Invoice';
        }
      });

    this.sub = this.form.valueChanges.subscribe(() => {
      const errors: string[] = [
        this.form.controls.miscInfoForm.errors,
        this.form.controls.itemListForm.errors,
      ]
        .filter((error) => {
          return error;
        })
        .map((error) => {
          if (error) {
            return error['message'];
          }
        });
      this.errors = [...new Set(errors)];
    });
  }

  onScroll() {
    if (
      this.invoiceFormElm.nativeElement.offsetHeight +
        this.invoiceFormElm.nativeElement.scrollTop >=
      this.invoiceFormElm.nativeElement.scrollHeight
    ) {
      this.renderer2.removeClass(this.buttonsElm.nativeElement, 'shadow');
    } else {
      this.renderer2.addClass(this.buttonsElm.nativeElement, 'shadow');
    }
  }

  applyDefaultData(invoice: Invoice): GroupForm {
    const cap_values: CapVal[] = invoice.items.map((item) => {
      return {
        itemName: item.name,
        price: item.price,
        qty: item.quantity,
      };
    });
    return {
      miscInfoForm: {
        invoiceDate: invoice.invoiceDate,
        paymentType: invoice.paymentType,
        paymentStatus:invoice.status
      },
      itemListForm: {
        cap_values,
      },
    };
  }

  onDiscardClick() {
    this.form.reset();
    this.resetSubject.next(true);
    this.matDialoug.closeAll();
  }

  convertItems(capVals: CapVal[]): Item[] {
    return capVals.map((capVal) => {
      return {
        name: capVal.itemName,
        price: capVal.price,
        quantity: capVal.qty,
      };
    });
  }

  scrollDown() {
    const maxScroll = this.invoiceFormElm.nativeElement.scrollHeight;
    this.invoiceFormElm.nativeElement.scrollTo({
      top: maxScroll,
      behavior: 'smooth',
    });
  }

  onGoBackClick() {
    this.invoicesStore.backNav();
  }

  onSubmit() {
    this.sendDataToBackend();
  }
  sendDataToBackend() {
    const {itemListForm, miscInfoForm } =
      this.form.value;
    if (itemListForm && miscInfoForm) {
      const invoice: Partial<Invoice> = {

        invoiceDate: miscInfoForm.invoiceDate,
        items: this.convertItems(itemListForm.cap_values),
        status:miscInfoForm.paymentStatus as any ,
        paymentType: miscInfoForm.paymentType,

        createdAt: new Date(),
      };
      if (this.currentEditedInvoice) {
        this.invoiceService
          .editInvoice(this.currentEditedInvoice.id, invoice)
          .subscribe(() => {
            if (this.currentEditedInvoice) {
              this.matDialoug.closeAll();
            }
          });
      } else {
        this.invoiceService.addInvoice(invoice).subscribe(() => {
          this.matDialoug.closeAll();
        });
      }
        
      this.invoicesStore.backNav();
    }
  }
}
