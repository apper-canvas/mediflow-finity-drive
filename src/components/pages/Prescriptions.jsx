import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import SearchBar from '@/components/molecules/SearchBar';
import PrescriptionTable from '@/components/organisms/PrescriptionTable';
import PrescriptionDialog from '@/components/molecules/PrescriptionDialog';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import prescriptionService from '@/services/api/prescriptionService';
import patientService from '@/services/api/patientService';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

  useEffect(() => {
    loadPrescriptions();
    loadPatients();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [prescriptions, searchQuery, statusFilter]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await prescriptionService.getAll();
      setPrescriptions(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    }
  };

  const filterPrescriptions = async () => {
    let filtered = prescriptions;

    if (searchQuery) {
      filtered = await prescriptionService.search(searchQuery);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredPrescriptions(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleNewPrescription = () => {
    setSelectedPrescription(null);
    setIsDialogOpen(true);
  };

  const handleEditPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
  };

  const handleDeletePrescription = (prescription) => {
    setPrescriptionToDelete(prescription);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await prescriptionService.delete(prescriptionToDelete.Id);
      setPrescriptions(prev => prev.filter(p => p.Id !== prescriptionToDelete.Id));
      toast.success('Prescription deleted successfully');
      setDeleteConfirmOpen(false);
      setPrescriptionToDelete(null);
    } catch (err) {
      toast.error('Failed to delete prescription');
    }
  };

  const handleSavePrescription = async (prescriptionData) => {
    try {
      if (selectedPrescription) {
        await prescriptionService.update(selectedPrescription.Id, prescriptionData);
        setPrescriptions(prev => prev.map(p => 
          p.Id === selectedPrescription.Id ? { ...prescriptionData, Id: p.Id } : p
        ));
        toast.success('Prescription updated successfully');
      } else {
        const newPrescription = await prescriptionService.create(prescriptionData);
        setPrescriptions(prev => [...prev, newPrescription]);
        toast.success('Prescription created successfully');
      }
      setIsDialogOpen(false);
      setSelectedPrescription(null);
    } catch (err) {
      toast.error(`Failed to ${selectedPrescription ? 'update' : 'create'} prescription`);
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPrescriptions} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-1">Manage patient prescriptions and refills</p>
          </div>
          <Button onClick={handleNewPrescription}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            New Prescription
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search by medication name..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredPrescriptions.length === 0 && !loading ? (
        <Empty
          title="No prescriptions found"
          description="Get started by creating your first prescription"
          actionLabel="New Prescription"
          onAction={handleNewPrescription}
        />
      ) : (
        <PrescriptionTable
          prescriptions={filteredPrescriptions}
          patients={patients}
          onViewPrescription={handleViewPrescription}
          onEditPrescription={handleEditPrescription}
          onDeletePrescription={handleDeletePrescription}
        />
      )}

      <PrescriptionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedPrescription(null);
        }}
        onSave={handleSavePrescription}
        prescription={selectedPrescription}
        patients={patients}
      />

      {viewDialogOpen && selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Prescription Details</h2>
              <button
                onClick={() => setViewDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-medium">{getPatientName(selectedPrescription.patientId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Medication</p>
                  <p className="font-medium">{selectedPrescription.medicationName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dosage</p>
                  <p className="font-medium">{selectedPrescription.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p className="font-medium">{selectedPrescription.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prescribed Date</p>
                  <p className="font-medium">{format(new Date(selectedPrescription.prescribedDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Refill Date</p>
                  <p className="font-medium">{format(new Date(selectedPrescription.refillDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Refills Remaining</p>
                  <p className="font-medium">{selectedPrescription.refillsRemaining}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prescribed By</p>
                  <p className="font-medium">{selectedPrescription.prescribedBy}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Instructions</p>
                  <p className="font-medium">{selectedPrescription.instructions || 'No instructions'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{selectedPrescription.notes || 'No notes'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmOpen && prescriptionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Prescription</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the prescription for {prescriptionToDelete.medicationName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPrescriptionToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prescriptions;