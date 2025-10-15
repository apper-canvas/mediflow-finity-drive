import invoiceData from '../mockData/invoices.json';

class InvoiceService {
  constructor() {
    this.invoices = [...invoiceData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  async getAll() {
    await this.delay();
    return [...this.invoices].sort((a, b) => new Date(b.IssueDate) - new Date(a.IssueDate));
  }

  async getById(id) {
    await this.delay();
    const invoice = this.invoices.find(inv => inv.Id === parseInt(id));
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return { ...invoice };
  }

  async create(invoice) {
    await this.delay();
    const newId = Math.max(...this.invoices.map(inv => inv.Id), 0) + 1;
    const newInvoice = {
      ...invoice,
      Id: newId,
      InvoiceNumber: `INV-${String(newId).padStart(5, '0')}`,
      IssueDate: new Date().toISOString().split('T')[0],
      Status: 'Pending',
      AmountPaid: 0,
      Payments: []
    };
    this.invoices.push(newInvoice);
    return { ...newInvoice };
  }

  async update(id, invoiceData) {
    await this.delay();
    const index = this.invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    
    // Calculate totals if items changed
    if (invoiceData.Items) {
      const totalAmount = invoiceData.Items.reduce((sum, item) => sum + item.Amount, 0);
      invoiceData.TotalAmount = totalAmount;
      invoiceData.BalanceDue = totalAmount - (this.invoices[index].AmountPaid || 0);
    }
    
    this.invoices[index] = {
      ...this.invoices[index],
      ...invoiceData
    };
    return { ...this.invoices[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    this.invoices.splice(index, 1);
    return true;
  }

  async search(query) {
    await this.delay();
    const lowerQuery = query.toLowerCase();
    return this.invoices.filter(invoice =>
      invoice.InvoiceNumber.toLowerCase().includes(lowerQuery) ||
      invoice.PatientName.toLowerCase().includes(lowerQuery)
    );
  }

  async getByPatient(patientId) {
    await this.delay();
    return this.invoices.filter(inv => inv.PatientId === parseInt(patientId));
  }

  async getByStatus(status) {
    await this.delay();
    if (!status || status === 'All') {
      return [...this.invoices];
    }
    return this.invoices.filter(inv => inv.Status === status);
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    return this.invoices.filter(inv => {
      const issueDate = new Date(inv.IssueDate);
      return issueDate >= new Date(startDate) && issueDate <= new Date(endDate);
    });
  }

  async recordPayment(id, payment) {
    await this.delay();
    const index = this.invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    const invoice = this.invoices[index];
    const newPayment = {
      Id: (invoice.Payments?.length || 0) + 1,
      Date: new Date().toISOString().split('T')[0],
      ...payment
    };

    invoice.Payments = [...(invoice.Payments || []), newPayment];
    invoice.AmountPaid = (invoice.AmountPaid || 0) + payment.Amount;
    invoice.BalanceDue = invoice.TotalAmount - invoice.AmountPaid;

    // Update status based on payment
    if (invoice.AmountPaid >= invoice.TotalAmount) {
      invoice.Status = 'Paid';
    } else if (invoice.AmountPaid > 0) {
      invoice.Status = 'Partial';
    }

    return { ...invoice };
  }

  async updateStatus(id, status) {
    await this.delay();
    const index = this.invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    this.invoices[index].Status = status;
    return { ...this.invoices[index] };
  }
}

export default new InvoiceService();