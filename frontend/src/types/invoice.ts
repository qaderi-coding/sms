// ==============================|| INVOICE TYPES ||============================== //

export interface InvoiceItems {
    id?: number;
    product?: string;
    description?: string;
    quantity?: number;
    amount?: number;
    total?: number;
}

export interface InvoiceAmount {
    subTotal: number;
    appliedTaxValue: number;
    appliedDiscountValue: number;
    taxesAmount: number;
    discountAmount: number;
    totalAmount: number;
}

export interface AddInvoice {
    id: number;
    name: string;
    description?: string;
    offerPrice: number;
    selectedQuantity?: number;
    totalAmount?: number;
}