// 顧客元帳ページ内で使用していたローカル型の分離

export interface Vehicle {
  id: string;
  type: string;
  color: string;
  number: string;
}

export interface UsageHistory {
  id: string;
  receptionNumber: string;
  date: string;
  storeName: string;
  staffName: string;
  category: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: 'completed' | 'absent';
}

export interface PreferenceForm {
  favoriteType: string;
  speakingStyle: string;
  dislikedType: string;
}

export interface ReceiptForm {
  recipient: string;
  note: string;
}

export type PetOption = 'dog' | 'cat' | 'none' | 'other';
export type WorkAreaOption = 'local' | 'business_trip';

// CustomerLedgerHeader 用の Props
import type { Customer } from '@/types';
export interface CustomerLedgerHeaderProps {
  customer?: Customer;
  onCustomerChange?: (customer: Partial<Customer>) => void;
  readOnly?: boolean;
}


