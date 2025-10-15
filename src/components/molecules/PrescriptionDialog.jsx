import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

function PrescriptionDialog({ isOpen, onClose, onSave, prescription, patients }) {
  const [formData, setFormData] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    prescribedDate: '',
    refillDate: '',
    refillsRemaining: 0,
    prescribedBy: '',
    instructions: '',
    status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (prescription) {
      setFormData(prescription);
    } else {
      setFormData({
        patientId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        prescribedDate: new Date().toISOString().split('T')[0],
        refillDate: '',
        refillsRemaining: 0,
        prescribedBy: '',
        instructions: '',
        status: 'Active',
        notes: ''
      });
    }
    setErrors({});
  }, [prescription, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.medicationName?.trim()) newErrors.medicationName = 'Medication name is required';
    if (!formData.dosage?.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData.frequency?.trim()) newErrors.frequency = 'Frequency is required';
    if (!formData.prescribedDate) newErrors.prescribedDate = 'Prescribed date is required';
    if (!formData.refillDate) newErrors.refillDate = 'Refill date is required';
    if (!formData.prescribedBy?.trim()) newErrors.prescribedBy = 'Prescribing doctor is required';

    if (formData.refillDate && formData.prescribedDate) {
      const refillDate = new Date(formData.refillDate);
      const prescribedDate = new Date(formData.prescribedDate);
      if (refillDate <= prescribedDate) {
        newErrors.refillDate = 'Refill date must be after prescribed date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        patientId: parseInt(formData.patientId),
        refillsRemaining: parseInt(formData.refillsRemaining) || 0
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {prescription ? 'Edit Prescription' : 'New Prescription'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => handleChange('patientId', e.target.value)}
              className={cn(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                errors.patientId ? "border-error" : "border-gray-300"
              )}
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.Id} value={patient.Id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="text-error text-sm mt-1">{errors.patientId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name *
              </label>
              <Input
                value={formData.medicationName}
                onChange={(e) => handleChange('medicationName', e.target.value)}
                placeholder="e.g., Lisinopril"
                className={errors.medicationName ? "border-error" : ""}
              />
              {errors.medicationName && (
                <p className="text-error text-sm mt-1">{errors.medicationName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage *
              </label>
              <Input
                value={formData.dosage}
                onChange={(e) => handleChange('dosage', e.target.value)}
                placeholder="e.g., 10mg"
                className={errors.dosage ? "border-error" : ""}
              />
              {errors.dosage && (
                <p className="text-error text-sm mt-1">{errors.dosage}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency *
            </label>
            <Input
              value={formData.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
              placeholder="e.g., Once daily"
              className={errors.frequency ? "border-error" : ""}
            />
            {errors.frequency && (
              <p className="text-error text-sm mt-1">{errors.frequency}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescribed Date *
              </label>
              <Input
                type="date"
                value={formData.prescribedDate}
                onChange={(e) => handleChange('prescribedDate', e.target.value)}
                className={errors.prescribedDate ? "border-error" : ""}
              />
              {errors.prescribedDate && (
                <p className="text-error text-sm mt-1">{errors.prescribedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refill Date *
              </label>
              <Input
                type="date"
                value={formData.refillDate}
                onChange={(e) => handleChange('refillDate', e.target.value)}
                className={errors.refillDate ? "border-error" : ""}
              />
              {errors.refillDate && (
                <p className="text-error text-sm mt-1">{errors.refillDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refills Remaining
              </label>
              <Input
                type="number"
                min="0"
                value={formData.refillsRemaining}
                onChange={(e) => handleChange('refillsRemaining', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescribed By *
            </label>
            <Input
              value={formData.prescribedBy}
              onChange={(e) => handleChange('prescribedBy', e.target.value)}
              placeholder="e.g., Dr. Sarah Johnson"
              className={errors.prescribedBy ? "border-error" : ""}
            />
            {errors.prescribedBy && (
              <p className="text-error text-sm mt-1">{errors.prescribedBy}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              placeholder="Special instructions for taking medication"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {prescription ? 'Update Prescription' : 'Create Prescription'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PrescriptionDialog;