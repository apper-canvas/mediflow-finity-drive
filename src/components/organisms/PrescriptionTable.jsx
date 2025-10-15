import { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';
import { cn } from '@/utils/cn';

function PrescriptionTable({ prescriptions, patients, onViewPrescription, onEditPrescription, onDeletePrescription, loading }) {
  const [sortField, setSortField] = useState('refillDate');
  const [sortDirection, setSortDirection] = useState('asc');

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPrescriptions = [...prescriptions].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'patientId') {
      aVal = getPatientName(a.patientId);
      bVal = getPatientName(b.patientId);
    }

    if (sortField === 'refillDate' || sortField === 'prescribedDate') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ChevronsUpDown" size={16} className="text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ApperIcon name="ChevronUp" size={16} className="text-primary" />
      : <ApperIcon name="ChevronDown" size={16} className="text-primary" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <ApperIcon name="Pill" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No prescriptions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('patientId')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Patient
                  <SortIcon field="patientId" />
                </div>
              </th>
              <th
                onClick={() => handleSort('medicationName')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Medication
                  <SortIcon field="medicationName" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th
                onClick={() => handleSort('refillDate')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Refill Date
                  <SortIcon field="refillDate" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Refills Left
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPrescriptions.map((prescription) => (
              <tr key={prescription.Id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getPatientName(prescription.patientId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {prescription.medicationName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {prescription.prescribedBy}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prescription.dosage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prescription.frequency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(prescription.refillDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {prescription.refillsRemaining}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={prescription.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPrescription(prescription)}
                      className="text-primary hover:text-primary/80"
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPrescription(prescription)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePrescription(prescription)}
                      className="text-error hover:text-error/80"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PrescriptionTable;