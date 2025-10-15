import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StaffGrid from "@/components/organisms/StaffGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import staffService from "@/services/api/staffService";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await staffService.getAll();
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setError("Failed to load staff members. Please try again.");
      console.error("Error loading staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, selectedRole);
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    applyFilters(searchQuery, role);
  };

  const applyFilters = (query, role) => {
    let filtered = [...staff];

    // Apply role filter
    if (role !== "All") {
      filtered = filtered.filter(member => member.role === role);
    }

    // Apply search filter
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm) ||
        member.role.toLowerCase().includes(searchTerm) ||
        member.specialization.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredStaff(filtered);
  };

  const handleViewStaff = (member) => {
    toast.info(`Viewing ${member.name}'s profile`);
    // In a real app, this would navigate to staff detail page
  };

  const handleAddStaff = () => {
    toast.info("Add new staff member form would open");
    // In a real app, this would navigate to add staff form
  };

  useEffect(() => {
    loadStaff();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStaff} />;
  }

  // Get unique roles for filtering
  const roles = ["All", ...new Set(staff.map(member => member.role))];

  // Calculate stats
  const doctorCount = staff.filter(s => s.role === "Doctor").length;
  const nurseCount = staff.filter(s => s.role === "Nurse").length;
  const otherStaffCount = staff.filter(s => !["Doctor", "Nurse"].includes(s.role)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Staff Directory
          </h1>
          <p className="text-gray-600 mt-2">
            Manage healthcare professionals and support staff.
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="UserPlus"
          onClick={handleAddStaff}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50 text-primary">
                <ApperIcon name="Users" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{doctorCount}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50 text-success">
                <ApperIcon name="Stethoscope" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nurses</p>
                <p className="text-2xl font-bold text-gray-900">{nurseCount}</p>
              </div>
              <div className="p-3 rounded-full bg-red-50 text-error">
                <ApperIcon name="Heart" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Support Staff</p>
                <p className="text-2xl font-bold text-gray-900">{otherStaffCount}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50 text-warning">
                <ApperIcon name="UserCheck" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <SearchBar
          placeholder="Search staff by name, role, or specialization..."
          onSearch={handleSearch}
          className="lg:w-96"
        />
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Filter by role:</span>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "primary" : "outline"}
                size="sm"
                onClick={() => handleRoleFilter(role)}
                className="text-xs"
              >
                {role}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Showing {filteredStaff.length} of {staff.length} staff members
        </span>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 && !loading ? (
        searchQuery || selectedRole !== "All" ? (
          <Empty
            title="No staff members found"
            description={`No staff members match your current filters.`}
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedRole("All");
              setFilteredStaff(staff);
            }}
            icon="Search"
          />
        ) : (
          <Empty
            title="No staff members"
            description="Start by adding your first staff member to the system."
            actionLabel="Add First Staff Member"
            onAction={handleAddStaff}
            icon="UserPlus"
          />
        )
      ) : (
        <StaffGrid
          staff={filteredStaff}
          onViewStaff={handleViewStaff}
        />
      )}

      {/* Available Specializations */}
      {staff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Award" size={20} />
              <span>Available Specializations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[...new Set(staff.map(s => s.specialization))].map((specialization) => (
                <span
                  key={specialization}
                  className="px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm"
                >
                  {specialization}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Staff;