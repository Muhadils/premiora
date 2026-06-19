export interface DuitkuItemDetails {
  name: string;
  price: number;
  quantity: number;
}

export interface DuitkuTransactionParams {
  merchantOrderId: string;
  paymentAmount: number;
  productDetails: string;
  email: string;
  phoneNumber?: string;
  customerVaName: string;
  paymentMethod?: string;
  itemDetails: DuitkuItemDetails[];
  returnUrl: string;
  callbackUrl: string;
  expiryPeriod?: number; // in minutes
}

export interface DuitkuTransactionResponse {
  merchantCode: string;
  reference: string;
  paymentUrl: string;
  statusCode: string;
  statusMessage: string;
}

export interface DuitkuCallbackNotification {
  merchantOrderId: string;
  amount: string;
  merchantCode: string;
  productDetail: string;
  additionalParam: string;
  paymentMethod: string;
  resultCode: string; // "00" = success, "01" = success with message, "02" = failed
  merchantUserId: string;
  reference: string;
  signature: string;
  publisherOrderId?: string;
  spUserHash?: string;
  settlementDate?: string;
  issuerCode?: string;
}
