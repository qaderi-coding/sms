TRANSACTION_TYPES = [
    ('sale', 'Sale'),
    ('purchase', 'Purchase'),
    ('expense', 'Expense'),
    ('loan_given', 'Loan Given'),
    ('loan_received', 'Loan Received'),
    ('loan_repayment_made', 'Loan Repayment Made'),
    ('loan_repayment_received', 'Loan Repayment Received'),
    ('payment_received', 'Payment Received'),
    ('payment_made', 'Payment Made'),
    ('withdrawal', 'Withdrawal'),
    ('return_sale', 'Return Sale'),
    ('return_purchase', 'Return Purchase'),
]

PARTY_TYPES = [
    ('customer', 'Customer'),
    ('supplier', 'Supplier'),
    ('owner', 'Owner'),
    ('none', 'None'),
]

STATUS_CHOICES = [
    ('unpaid', 'Unpaid'),
    ('partial', 'Partial'),
    ('paid', 'Paid'),
]

PAYMENT_METHODS = [
    ('cash', 'Cash'),
    ('bank', 'Bank'),
    ('transfer', 'Transfer'),
]

EXPENSE_CATEGORIES = [
    ('transport', 'Transport'),
    ('commission', 'Commission'),
    ('rent', 'Rent'),
    ('salary', 'Salary'),
    ('misc', 'Miscellaneous'),
]

LOAN_STATUS = [
    ('active', 'Active'),
    ('closed', 'Closed'),
]