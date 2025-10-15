import { format } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { Card, CardContent } from '@/components/atoms/Card';

const DischargeTable = ({ discharges, getPatientName }) => {
  return (
    <div className="space-y-4">
      {discharges.map((discharge) => (
        <Card key={discharge.Id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <ApperIcon name="User" size={20} className="text-gray-400" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {getPatientName(discharge.patientId)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Room {discharge.roomNumber} • {discharge.department}
                  </p>
                </div>
              </div>
              <Badge variant="default">Discharged</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Admission Date</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(discharge.admissionDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Discharge Date</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(discharge.dischargeDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Attending Physician</p>
                <p className="text-sm text-gray-900">{discharge.attendingPhysician}</p>
              </div>
              {discharge.followUpDate && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Follow-up Date</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(discharge.followUpDate), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Admission Reason</p>
                <p className="text-sm text-gray-600">{discharge.admissionReason}</p>
              </div>

              {discharge.dischargeSummary && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Discharge Summary</p>
                  <p className="text-sm text-gray-600">{discharge.dischargeSummary}</p>
                </div>
              )}

              {discharge.followUpInstructions && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Follow-up Instructions</p>
                  <p className="text-sm text-gray-600">{discharge.followUpInstructions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DischargeTable;