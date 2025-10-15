import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import admissionService from '@/services/api/admissionService';
import patientService from '@/services/api/patientService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import AdmissionTable from '@/components/organisms/AdmissionTable';
import DischargeTable from '@/components/organisms/DischargeTable';
import AdmissionForm from '@/components/molecules/AdmissionForm';

const AdmissionDischarge = () => {
  const [activeTab, setActiveTab] = useState('admissions');
  const [admissions, setAdmissions] = useState([]);
  const [discharges, setDischarges] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allAdmissions, allPatients] = await Promise.all([
        admissionService.getAll(),
        patientService.getAll()
      ]);
      
      const activeAdmissions = allAdmissions.filter(a => a.status === 'Admitted');
      const dischargedAdmissions = allAdmissions.filter(a => a.status === 'Discharged');
      
      setAdmissions(activeAdmissions);
      setDischarges(dischargedAdmissions);
      setPatients(allPatients);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load admission data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdmitPatient = async (admissionData) => {
    try {
      const admission = await admissionService.create(admissionData);
      await patientService.updateStatus(admissionData.patientId, 'Admitted', admission.Id);
      toast.success('Patient admitted successfully');
      setShowAdmissionForm(false);
      loadData();
    } catch (err) {
      toast.error('Failed to admit patient: ' + err.message);
    }
  };

  const handleDischarge = async (admissionId, dischargeData) => {
    try {
      const admission = await admissionService.getById(admissionId);
      await admissionService.discharge(admissionId, dischargeData);
      await patientService.updateStatus(admission.patientId, 'Discharged');
      toast.success('Patient discharged successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to discharge patient: ' + err.message);
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission & Discharge</h1>
          <p className="text-sm text-gray-500 mt-1">Manage patient admissions and discharges</p>
        </div>
        <Button
          onClick={() => setShowAdmissionForm(true)}
          icon="UserPlus"
        >
          Admit Patient
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('admissions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'admissions'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Admissions ({admissions.length})
          </button>
          <button
            onClick={() => setActiveTab('discharges')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'discharges'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Discharge History ({discharges.length})
          </button>
        </nav>
      </div>

      {activeTab === 'admissions' && (
        <Card>
          <CardHeader>
            <CardTitle>Currently Admitted Patients</CardTitle>
          </CardHeader>
          <CardContent>
            {admissions.length === 0 ? (
              <Empty message="No patients currently admitted" />
            ) : (
              <AdmissionTable
                admissions={admissions}
                getPatientName={getPatientName}
                onDischarge={handleDischarge}
              />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'discharges' && (
        <Card>
          <CardHeader>
            <CardTitle>Discharge History</CardTitle>
          </CardHeader>
          <CardContent>
            {discharges.length === 0 ? (
              <Empty message="No discharge records found" />
            ) : (
              <DischargeTable
                discharges={discharges}
                getPatientName={getPatientName}
              />
            )}
          </CardContent>
        </Card>
      )}

      {showAdmissionForm && (
        <AdmissionForm
          patients={patients.filter(p => p.admissionStatus === 'Active')}
          onSubmit={handleAdmitPatient}
          onCancel={() => setShowAdmissionForm(false)}
        />
      )}
    </div>
  );
};

export default AdmissionDischarge;