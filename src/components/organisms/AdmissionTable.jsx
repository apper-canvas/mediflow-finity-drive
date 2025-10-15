import { useState } from 'react';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import DischargeForm from '@/components/molecules/DischargeForm';

const AdmissionTable = ({ admissions, getPatientName, onDischarge }) => {
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showDischargeForm, setShowDischargeForm] = useState(false);

  const handleDischargeClick = (admission) => {
    setSelectedAdmission(admission);
    setShowDischargeForm(true);
  };

  const handleDischargeSubmit = async (dischargeData) => {
    await onDischarge(selectedAdmission.Id, dischargeData);
    setShowDischargeForm(false);
    setSelectedAdmission(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Room</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Admission Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Physician</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reason</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((admission) => (
              <tr key={admission.Id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="User" size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {getPatientName(admission.patientId)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-900 font-medium">{admission.roomNumber}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{admission.department}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">
                    {format(new Date(admission.admissionDate), 'MMM d, yyyy')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{admission.attendingPhysician}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                    {admission.admissionReason}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="success">Admitted</Badge>
                </td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDischargeClick(admission)}
                    icon="UserMinus"
                  >
                    Discharge
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDischargeForm && selectedAdmission && (
        <DischargeForm
          admissionId={selectedAdmission.Id}
          onSubmit={handleDischargeSubmit}
          onCancel={() => {
            setShowDischargeForm(false);
            setSelectedAdmission(null);
          }}
        />
      )}
    </>
  );
};

export default AdmissionTable;