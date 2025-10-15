import { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';

function InvoiceTable({ invoices, onViewInvoice, onEditInvoice }) {
  const [sortField, setSortField] = useState('IssueDate');
  const [sortDirection, setSortDirection] = useState('desc');

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const sortedInvoices = [...invoices].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle date sorting
    if (sortField === 'IssueDate' || sortField === 'DueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  function SortIcon({ field }) {
    if (sortField !== field) return <ApperIcon name="ChevronsUpDown" size={14} />;
    return sortDirection === 'asc' 
      ? <ApperIcon name="ChevronUp" size={14} />
      : <ApperIcon name="ChevronDown" size={14} />;
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th
                  onClick={() => handleSort('InvoiceNumber')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Invoice #
                    <SortIcon field="InvoiceNumber" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('PatientName')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Patient
                    <SortIcon field="PatientName" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('IssueDate')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Issue Date
                    <SortIcon field="IssueDate" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('TotalAmount')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Total
                    <SortIcon field="TotalAmount" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('AmountPaid')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Paid
                    <SortIcon field="AmountPaid" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('BalanceDue')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Balance
                    <SortIcon field="BalanceDue" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInvoices.map((invoice) => (
                <tr key={invoice.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.InvoiceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.PatientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(invoice.IssueDate), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${invoice.TotalAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-success font-medium">
                      ${invoice.AmountPaid.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${invoice.BalanceDue > 0 ? 'text-error' : 'text-gray-900'}`}>
                      ${invoice.BalanceDue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.Status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => onViewInvoice(invoice)}
                        variant="ghost"
                        size="sm"
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      <Button
                        onClick={() => onEditInvoice(invoice)}
                        variant="ghost"
                        size="sm"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedInvoices.map((invoice) => (
          <div
            key={invoice.Id}
            className="bg-white rounded-lg shadow p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{invoice.InvoiceNumber}</p>
                <p className="text-sm text-gray-600 mt-1">{invoice.PatientName}</p>
              </div>
              <StatusBadge status={invoice.Status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Issue Date</p>
                <p className="font-medium">{format(new Date(invoice.IssueDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-medium">${invoice.TotalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount Paid</p>
                <p className="font-medium text-success">${invoice.AmountPaid.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Balance Due</p>
                <p className={`font-medium ${invoice.BalanceDue > 0 ? 'text-error' : 'text-gray-900'}`}>
                  ${invoice.BalanceDue.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={() => onViewInvoice(invoice)}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <ApperIcon name="Eye" size={16} />
                View
              </Button>
              <Button
                onClick={() => onEditInvoice(invoice)}
                variant="ghost"
                size="sm"
                className="flex-1"
              >
                <ApperIcon name="Edit" size={16} />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default InvoiceTable;