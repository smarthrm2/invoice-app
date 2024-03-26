import { Timestamp } from '@angular/fire/firestore';

export interface InvoiceResponse {
  id: string;
  createdAt: Timestamp;
  invoiceDate: Timestamp;
  items: Item[];
  status: Status;
  paymentType: number;
}

export interface Invoice {
  id: string;
  createdAt: Date;
  invoiceDate: Date;
  items: Item[];
  paymentType: number;
  status?:string;
}

export type Status = 'Paid' | 'Pending' | 'Partial';

export interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  city: string;
  country: string;
  postCode: string;
  street: string;
}

export interface StatusParams {
  pending: boolean | null;
  paid: boolean | null;
  partial: boolean | null;
}

export interface ItemListForm {
  cap_values: CapVal[];
}

export interface CapVal {
  itemName: string;
  price: number;
  qty: number;
}
