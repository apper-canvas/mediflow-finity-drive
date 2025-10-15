import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import invoiceService from '@/services/api/invoiceService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';
import ApperIcon from '@/components/ApperIcon';

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    loadInvoice();
  }, [id]);

  async function loadInvoice() {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getById(id);
      setInvoice(data);
    } catch (err) {
      setError(err.message || 'Failed to load invoice');
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkPaid() {
    if (!confirm('Mark this invoice as paid?')) return;

    try {
      await invoiceService.updateStatus(id, 'Paid');
      toast.success('Invoice marked as paid');
      loadInvoice();
    } catch (err) {
      toast.error('Failed to update invoice status');
    }
  }

  async function handleRecordPayment() {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    try {
      await invoiceService.recordPayment(id, {
        Amount: parseFloat(paymentAmount),
        PaymentMethod: paymentMethod,
        Notes: 'Payment recorded'
      });
      toast.success('Payment recorded successfully');
      setShowPaymentModal(false);
      setPaymentAmount('');
      loadInvoice();
    } catch (err) {
      toast.error('Failed to record payment');
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;

    try {
      await invoiceService.delete(id);
      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (err) {
      toast.error('Failed to delete invoice');
    }
  }

  function handleSendReminder() {
    toast.info('Payment reminder sent to patient');
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInvoice} />;
  if (!invoice) return <Error message="Invoice not found" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/invoices')}
            className="mb-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Invoices
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{invoice.InvoiceNumber}</h1>
          <p className="text-gray-600 mt-1">Invoice Details</p>
        </div>
        <div className="flex gap-2">
          {invoice.Status !== 'Paid' && (
            <Button onClick={() => setShowPaymentModal(true)} variant="secondary">
              <ApperIcon name="DollarSign" size={16} />
              Record Payment
            </Button>
          )}
          <Button onClick={handleDelete} variant="ghost" className="text-error hover:bg-red-50">
            <ApperIcon name="Trash2" size={16} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Invoice Information</CardTitle>
                  <div className="mt-2">
                    <StatusBadge status={invoice.Status} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-medium">{invoice.PatientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-medium">{format(new Date(invoice.IssueDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{format(new Date(invoice.DueDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-medium">{invoice.InvoiceNumber}</p>
                </div>
              </div>
              {invoice.Notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="mt-1">{invoice.Notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Description</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Qty</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Rate</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.Items.map((item) => (
                      <tr key={item.Id} className="border-b last:border-0">
                        <td className="py-3 px-2">{item.Description}</td>
                        <td className="text-center py-3 px-2">{item.Quantity}</td>
                        <td className="text-right py-3 px-2">${item.Rate.toFixed(2)}</td>
                        <td className="text-right py-3 px-2 font-medium">${item.Amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan="3" className="text-right py-3 px-2 font-medium">Total Amount:</td>
                      <td className="text-right py-3 px-2 font-bold text-lg">${invoice.TotalAmount.toFixed(2)}</td>
                    </tr>
                    {invoice.AmountPaid > 0 && (
                      <>
                        <tr>
                          <td colSpan="3" className="text-right py-2 px-2 text-gray-600">Amount Paid:</td>
                          <td className="text-right py-2 px-2 text-success font-medium">-${invoice.AmountPaid.toFixed(2)}</td>
                        </tr>
                        <tr className="border-t">
                          <td colSpan="3" className="text-right py-3 px-2 font-medium">Balance Due:</td>
                          <td className="text-right py-3 px-2 font-bold text-lg text-error">${invoice.BalanceDue.toFixed(2)}</td>
                        </tr>
                      </>
                    )}
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {invoice.Payments && invoice.Payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.Payments.map((payment) => (
                    <div key={payment.Id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">${payment.Amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{payment.PaymentMethod}</p>
                        {payment.Notes && <p className="text-xs text-gray-500 mt-1">{payment.Notes}</p>}
                      </div>
                      <p className="text-sm text-gray-600">{format(new Date(payment.Date), 'MMM dd, yyyy')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoice.Status === 'Pending' && (
                <Button onClick={handleMarkPaid} className="w-full" variant="primary">
                  <ApperIcon name="CheckCircle" size={16} />
                  Mark as Paid
                </Button>
              )}
              {invoice.Status !== 'Paid' && invoice.Status !== 'Cancelled' && (
                <>
                  <Button onClick={() => setShowPaymentModal(true)} className="w-full" variant="secondary">
                    <ApperIcon name="DollarSign" size={16} />
                    Record Payment
                  </Button>
                  <Button onClick={handleSendReminder} className="w-full" variant="ghost">
                    <ApperIcon name="Send" size={16} />
                    Send Reminder
                  </Button>
                </>
              )}
              <Button onClick={() => window.print()} className="w-full" variant="ghost">
                <ApperIcon name="Printer" size={16} />
                Print Invoice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">${invoice.TotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium text-success">${invoice.AmountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-medium">Balance Due</span>
                <span className="font-bold text-lg text-error">${invoice.BalanceDue.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Record Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={invoice.BalanceDue}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: ${invoice.BalanceDue.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Check">Check</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleRecordPayment} className="flex-1">
                  Record Payment
                </Button>
                <Button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentAmount('');
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceDetail;