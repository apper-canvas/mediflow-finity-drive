import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import invoiceService from '@/services/api/invoiceService';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import InvoiceTable from '@/components/organisms/InvoiceTable';
import ApperIcon from '@/components/ApperIcon';

function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchQuery, statusFilter, invoices]);

  async function loadInvoices() {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getAll();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }

  async function filterInvoices() {
    let filtered = [...invoices];

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = await invoiceService.getByStatus(statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(invoice =>
        invoice.InvoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.PatientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInvoices(filtered);
  }

  async function handleSearch(query) {
    setSearchQuery(query);
  }

  function handleViewInvoice(invoice) {
    navigate(`/invoices/${invoice.Id}`);
  }

  function handleEditInvoice(invoice) {
    navigate(`/invoices/${invoice.Id}`);
  }

  function handleCreateInvoice() {
    navigate('/invoices/create');
  }

  function handleStatusFilterChange(e) {
    setStatusFilter(e.target.value);
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInvoices} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage patient invoices and payments</p>
        </div>
        <Button onClick={handleCreateInvoice} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={16} />
          Create Invoice
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by invoice number or patient name..."
            onSearch={handleSearch}
            value={searchQuery}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <Empty
          title="No invoices found"
          description={searchQuery || statusFilter !== 'All' 
            ? "Try adjusting your search or filter criteria" 
            : "Create your first invoice to get started"}
          actionLabel="Create Invoice"
          onAction={handleCreateInvoice}
        />
      ) : (
        <InvoiceTable
          invoices={filteredInvoices}
          onViewInvoice={handleViewInvoice}
          onEditInvoice={handleEditInvoice}
        />
      )}
    </div>
  );
}

export default Invoices;