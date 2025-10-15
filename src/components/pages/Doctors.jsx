import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import StaffGrid from '@/components/organisms/StaffGrid';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import staffService from '@/services/api/staffService';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    applyFilters(searchQuery, roleFilter);
  }, [searchQuery, roleFilter, doctors]);

  async function loadDoctors() {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query) {
    setSearchQuery(query);
  }

  function handleRoleFilter(role) {
    setRoleFilter(role);
  }

  function applyFilters(query, role) {
    let filtered = [...doctors];

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(lowerQuery) ||
          doctor.specialization?.toLowerCase().includes(lowerQuery) ||
          doctor.email.toLowerCase().includes(lowerQuery) ||
          doctor.phone.includes(lowerQuery)
      );
    }

    if (role !== 'All') {
      filtered = filtered.filter((doctor) => doctor.role === role);
    }

    setFilteredDoctors(filtered);
  }

  function handleViewDoctor(doctor) {
    toast.info(`Viewing details for Dr. ${doctor.name}`);
  }

  function handleAddDoctor() {
    toast.info('Add new doctor functionality');
  }

  if (loading) {
    return <Loading message="Loading doctors..." />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadDoctors}
      />
    );
  }

  const doctorRoles = ['All', ...new Set(doctors.map((d) => d.role))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage medical staff and their schedules
          </p>
        </div>
        <Button
          onClick={handleAddDoctor}
          icon="UserPlus"
          className="w-full sm:w-auto"
        >
          Add Doctor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search doctors by name, specialization, email, or phone..."
                  onSearch={handleSearch}
                  value={searchQuery}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {doctorRoles.map((role) => (
                  <Button
                    key={role}
                    variant={roleFilter === role ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleRoleFilter(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            {filteredDoctors.length === 0 ? (
              <Empty
                icon="Users"
                title="No doctors found"
                description={
                  searchQuery || roleFilter !== 'All'
                    ? 'Try adjusting your search or filters'
                    : 'Start by adding your first doctor'
                }
              />
            ) : (
              <StaffGrid
                staff={filteredDoctors}
                onViewStaff={handleViewDoctor}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Doctors;