import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import PatientTable from "@/components/organisms/PatientTable";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import patientService from "@/services/api/patientService";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError("Failed to load patients. Please try again.");
      console.error("Error loading patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredPatients(patients);
      return;
    }

    try {
      const searchResults = await patientService.search(query);
      setFilteredPatients(searchResults);
    } catch (err) {
      toast.error("Error searching patients");
      console.error("Search error:", err);
    }
  };

  const handleViewPatient = (patient) => {
    navigate(`/patients/${patient.Id}`);
  };

  const handleEditPatient = (patient) => {
    navigate(`/patients/${patient.Id}/edit`);
  };

  const handleAddPatient = () => {
    navigate("/patients/new");
  };

  useEffect(() => {
    loadPatients();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPatients} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Patients
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and view all patient records and information.
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="UserPlus"
          onClick={handleAddPatient}
          className="sm:w-auto"
        >
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          placeholder="Search patients by name, email, or phone..."
          onSearch={handleSearch}
          className="sm:w-96"
        />
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Showing {filteredPatients.length} of {patients.length} patients
          </span>
        </div>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 && !loading ? (
        searchQuery ? (
          <Empty
            title="No patients found"
            description={`No patients match your search for "${searchQuery}".`}
            actionLabel="Clear Search"
            onAction={() => handleSearch("")}
            icon="Search"
          />
        ) : (
          <Empty
            title="No patients registered"
            description="Start by adding your first patient to the system."
            actionLabel="Add First Patient"
            onAction={handleAddPatient}
            icon="UserPlus"
          />
        )
      ) : (
        <PatientTable
          patients={filteredPatients}
          onViewPatient={handleViewPatient}
          onEditPatient={handleEditPatient}
        />
      )}
    </div>
  );
};

export default Patients;