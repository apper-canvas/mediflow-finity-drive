import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';

const DischargeForm = ({ patient, admissionId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    dischargeDate: new Date().toISOString().split('T')[0],
    dischargeSummary: '',
    followUpInstructions: '',
    followUpDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dischargeSummary || !formData.followUpInstructions) {
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Discharge Patient</CardTitle>
        </CardHeader>
        <CardContent>
          {patient && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-700">Patient</p>
              <p className="text-base text-gray-900">
                {patient.firstName} {patient.lastName} (ID: {patient.Id})
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discharge Date *
              </label>
              <Input
                type="date"
                name="dischargeDate"
                value={formData.dischargeDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discharge Summary *
              </label>
              <textarea
                name="dischargeSummary"
                value={formData.dischargeSummary}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Enter comprehensive discharge summary including diagnosis, treatment provided, and patient condition at discharge..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-up Instructions *
              </label>
              <textarea
                name="followUpInstructions"
                value={formData.followUpInstructions}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Enter detailed follow-up instructions including medications, activity restrictions, diet, and warning signs..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-up Appointment Date
              </label>
              <Input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                min={formData.dischargeDate}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                Discharge Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DischargeForm;