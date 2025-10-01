export interface Promotion {
  id: string;
  title: string;
  description: string;
  provider: string;
  startDate: string;
  endDate: string;
  link: string;
  catagory: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export type Provider = 'AIS' | 'DTAC' | 'True' | 'NT' | 'TOT' | 'All';
export type Category = 'Prepaid' | 'Postpaid' | 'Internet' | 'Roaming' | 'All';