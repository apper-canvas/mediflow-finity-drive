import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const AppointmentDialog = ({
  isOpen,
  onClose,
  onSave,
  patients = [],
  staff = [],
  initialDate = null,
  initialTime = null
}) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: initialDate || '',
    time: initialTime || '',
    duration: 30,
    type: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        patientId: '',
        doctorId: '',
        date: initialDate || '',
        time: initialTime || '',
        duration: 30,
        type: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen, initialDate, initialTime]);

  const appointmentTypes = [
    'Routine Checkup',
    'Consultation',
    'Follow-up',
    'Specialist Visit',
    'Therapy Session',
    'Physical Therapy',
    'Lab Work',
    'Emergency'
  ];

  const durations = [15, 30, 45, 60, 90, 120];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Doctor is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.type) {
      newErrors.type = 'Appointment type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  const doctors = staff.filter(s => s.role === 'Doctor' || s.role === 'Specialist');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Schedule New Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient <span className="text-error">*</span>
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => handleChange('patientId', e.target.value)}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                errors.patientId ? "border-error" : "border-gray-300"
              )}
            >
              <option value="">Select a patient</option>
              {patients.map(patient => (
                <option key={patient.Id} value={patient.Id}>
                  {patient.name} - {patient.mrn}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="mt-1 text-sm text-error">{errors.patientId}</p>
            )}
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor <span className="text-error">*</span>
            </label>
            <select
              value={formData.doctorId}
              onChange={(e) => handleChange('doctorId', e.target.value)}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                errors.doctorId ? "border-error" : "border-gray-300"
              )}
            >
              <option value="">Select a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.Id} value={doctor.Id}>
                  Dr. {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <p className="mt-1 text-sm text-error">{errors.doctorId}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-error">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                error={errors.date}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-error">*</span>
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                error={errors.time}
              />
            </div>
          </div>

          {/* Appointment Type and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type <span className="text-error">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.type ? "border-error" : "border-gray-300"
                )}
              >
                <option value="">Select type</option>
                {appointmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-error">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration} min</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              placeholder="Additional notes or instructions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon="Calendar"
            >
              Schedule Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentDialog;