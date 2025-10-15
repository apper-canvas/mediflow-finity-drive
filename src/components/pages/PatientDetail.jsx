import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import patientService from '@/services/api/patientService';
import admissionService from '@/services/api/admissionService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';
import ApperIcon from '@/components/ApperIcon';
import LabResultsSection from '@/components/organisms/LabResultsSection';
import AdmissionForm from '@/components/molecules/AdmissionForm';
import DischargeForm from '@/components/molecules/DischargeForm';
const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [showDischargeForm, setShowDischargeForm] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [id]);

const loadPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getById(id);
      setPatient(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdmitPatient = async (admissionData) => {
    try {
      const admission = await admissionService.create({
        ...admissionData,
        patientId: parseInt(id)
      });
      await patientService.updateStatus(id, 'Admitted', admission.Id);
      toast.success('Patient admitted successfully');
      setShowAdmissionForm(false);
      loadPatient();
    } catch (err) {
      toast.error('Failed to admit patient: ' + err.message);
    }
  };

  const handleDischargePatient = async (dischargeData) => {
    try {
      if (patient.currentAdmissionId) {
        await admissionService.discharge(patient.currentAdmissionId, dischargeData);
        await patientService.updateStatus(id, 'Discharged');
        toast.success('Patient discharged successfully');
        setShowDischargeForm(false);
        loadPatient();
      }
    } catch (err) {
      toast.error('Failed to discharge patient: ' + err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!patient) return <Error message="Patient not found" />;

const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate('/patients')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-sm text-gray-500">Patient ID: {patient.Id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={patient.status} type="patient" />
          {patient.admissionStatus === 'Active' && (
            <Button
              onClick={() => setShowAdmissionForm(true)}
              icon="UserPlus"
            >
              Admit Patient
            </Button>
          )}
          {patient.admissionStatus === 'Admitted' && (
            <Button
              onClick={() => setShowDischargeForm(true)}
              variant="secondary"
              icon="UserMinus"
            >
              Discharge Patient
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date of Birth</h3>
                <p className="text-base text-gray-900">
                  {format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')} ({age} years old)
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Gender</h3>
                <p className="text-base text-gray-900 capitalize">{patient.gender}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Blood Type</h3>
                <p className="text-base text-gray-900 font-medium">{patient.bloodType}</p>
              </div>
              {patient.height && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Height</h3>
                  <p className="text-base text-gray-900">{patient.height}</p>
                </div>
              )}
              {patient.weight && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Weight</h3>
                  <p className="text-base text-gray-900">{patient.weight}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                <p className="text-base text-gray-900">{patient.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-base text-gray-900">{patient.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Date</h3>
                <p className="text-base text-gray-900">
                  {format(new Date(patient.registrationDate), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                <p className="text-base text-gray-900">{patient.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                <p className="text-base text-gray-900">{patient.emergencyContact.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Relationship</h3>
                <p className="text-base text-gray-900 capitalize">
                  {patient.emergencyContact.relationship}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                <p className="text-base text-gray-900">{patient.emergencyContact.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

{/* Allergies & Current Medications */}
      {(patient.allergies?.length > 0 || patient.currentMedications?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="AlertCircle" size={20} />
              Allergies & Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patient.allergies?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-error/10 text-error"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {patient.currentMedications?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Current Medications</h3>
                  <ul className="space-y-1">
                    {patient.currentMedications.map((medication, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <ApperIcon name="Pill" size={16} className="mr-2 mt-0.5 text-primary" />
                        {medication}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical History & Conditions */}
      {(patient.medicalHistory?.length > 0 || patient.existingConditions?.length > 0 || patient.pastSurgeries?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="FileText" size={20} />
              Medical History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {patient.existingConditions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Existing Medical Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.existingConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-warning/10 text-warning"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patient.medicalHistory?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Condition Details</h3>
                  <div className="space-y-4">
                    {patient.medicalHistory.map((history, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="FileText" size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{history.condition}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Diagnosed: {format(new Date(history.diagnosedDate), 'MMMM d, yyyy')}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                history.status === 'Active'
                                  ? 'bg-warning/10 text-warning'
                                  : history.status === 'Resolved'
                                  ? 'bg-success/10 text-success'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {history.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {patient.pastSurgeries?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Past Surgeries</h3>
                  <ul className="space-y-1">
                    {patient.pastSurgeries.map((surgery, index) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start">
                        <ApperIcon name="Activity" size={16} className="mr-2 mt-0.5 text-primary" />
                        {surgery}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Family History & Primary Care */}
      {(patient.familyHistory || patient.primaryPhysician) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Users" size={20} />
              Family History & Primary Care
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patient.familyHistory && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Family Medical History</h3>
                  <p className="text-base text-gray-900">{patient.familyHistory}</p>
                </div>
              )}
              {patient.primaryPhysician && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Primary Physician</h3>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Stethoscope" size={16} className="text-primary" />
                    <p className="text-base text-gray-900 font-medium">{patient.primaryPhysician}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
<LabResultsSection patientId={patient.Id} />

      {showAdmissionForm && (
        <AdmissionForm
          patient={patient}
          onSubmit={handleAdmitPatient}
          onCancel={() => setShowAdmissionForm(false)}
        />
      )}

      {showDischargeForm && (
        <DischargeForm
          patient={patient}
          admissionId={patient.currentAdmissionId}
          onSubmit={handleDischargePatient}
          onCancel={() => setShowDischargeForm(false)}
        />
      )}
    </div>
  );
};

export default PatientDetail;