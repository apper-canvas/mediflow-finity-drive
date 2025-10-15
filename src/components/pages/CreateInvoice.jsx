import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import invoiceService from '@/services/api/invoiceService';
import patientService from '@/services/api/patientService';
import Loading from '@/components/ui/Loading';
import Button from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

function CreateInvoice() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { Description: '', Quantity: 1, Rate: 0, Amount: 0 }
  ]);

  useEffect(() => {
    loadPatients();
    // Set default due date to 30 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }

  function handleAddItem() {
    setItems([...items, { Description: '', Quantity: 1, Rate: 0, Amount: 0 }]);
  }

  function handleRemoveItem(index) {
    if (items.length === 1) {
      toast.error('Invoice must have at least one item');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  }

  function handleItemChange(index, field, value) {
    const newItems = [...items];
    newItems[index][field] = value;

    // Calculate amount if quantity or rate changes
    if (field === 'Quantity' || field === 'Rate') {
      const qty = parseFloat(newItems[index].Quantity) || 0;
      const rate = parseFloat(newItems[index].Rate) || 0;
      newItems[index].Amount = qty * rate;
    }

    setItems(newItems);
  }

  function calculateTotal() {
    return items.reduce((sum, item) => sum + (parseFloat(item.Amount) || 0), 0);
  }

  function validateForm() {
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return false;
    }

    if (!dueDate) {
      toast.error('Please set a due date');
      return false;
    }

    if (items.some(item => !item.Description || !item.Quantity || !item.Rate)) {
      toast.error('Please complete all item details');
      return false;
    }

    if (calculateTotal() <= 0) {
      toast.error('Invoice total must be greater than zero');
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const patient = patients.find(p => p.Id === parseInt(selectedPatient));
      const invoiceData = {
        PatientId: parseInt(selectedPatient),
        PatientName: `${patient.FirstName} ${patient.LastName}`,
        DueDate: dueDate,
        TotalAmount: calculateTotal(),
        Items: items.map((item, index) => ({
          Id: index + 1,
          Description: item.Description,
          Quantity: parseFloat(item.Quantity),
          Rate: parseFloat(item.Rate),
          Amount: parseFloat(item.Amount)
        })),
        Notes: notes
      };

      const newInvoice = await invoiceService.create(invoiceData);
      toast.success('Invoice created successfully');
      navigate(`/invoices/${newInvoice.Id}`);
    } catch (err) {
      toast.error('Failed to create invoice');
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/invoices')}
          className="mb-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Invoices
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
        <p className="text-gray-600 mt-1">Generate a new invoice for patient services</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient <span className="text-error">*</span>
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.Id} value={patient.Id}>
                      {patient.FirstName} {patient.LastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any additional notes or comments..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Line Items</CardTitle>
              <Button type="button" onClick={handleAddItem} variant="secondary" size="sm">
                <ApperIcon name="Plus" size={16} />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.Description}
                      onChange={(e) => handleItemChange(index, 'Description', e.target.value)}
                      placeholder="Service or item description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qty <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      value={item.Quantity}
                      onChange={(e) => handleItemChange(index, 'Quantity', e.target.value)}
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      value={item.Rate}
                      onChange={(e) => handleItemChange(index, 'Rate', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={`$${item.Amount.toFixed(2)}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-error hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <span className="text-lg font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button type="submit" className="flex-1">
            <ApperIcon name="CheckCircle" size={16} />
            Create Invoice
          </Button>
          <Button
            type="button"
            onClick={() => navigate('/invoices')}
            variant="ghost"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;