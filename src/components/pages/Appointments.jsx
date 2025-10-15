import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import appointmentService from "@/services/api/appointmentService";
import patientService from "@/services/api/patientService";
import staffService from "@/services/api/staffService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("calendar");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const [appointmentsData, patientsData, staffData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        staffService.getAll()
      ]);

      setAppointments(appointmentsData);
      setPatients(patientsData);
      setStaff(staffData);
      
      // Get recent appointments (last 10)
      const sortedAppointments = appointmentsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setRecentAppointments(sortedAppointments);

    } catch (err) {
      setError("Failed to load appointments. Please try again.");
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentClick = (appointment) => {
    toast.info(`Clicked appointment: ${appointment.type} at ${appointment.time}`);
  };

  const handleNewAppointment = (date = null, time = null) => {
    toast.info("New appointment modal would open here");
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id.toString() === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    const doctor = staff.find(s => s.Id.toString() === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAppointments} />;
  }

  const todaysAppointments = appointments.filter(
    apt => apt.date === new Date().toISOString().split("T")[0]
  );

  const upcomingAppointments = appointments.filter(
    apt => new Date(apt.date) > new Date() && apt.status === "Scheduled"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage patient appointments efficiently.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "calendar" ? "primary" : "ghost"}
              size="sm"
              icon="Calendar"
              onClick={() => setViewMode("calendar")}
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              icon="List"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
          
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleNewAppointment}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todaysAppointments.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50 text-primary">
                <ApperIcon name="Calendar" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50 text-success">
                <ApperIcon name="Clock" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total This Month</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50 text-warning">
                <ApperIcon name="TrendingUp" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="xl:col-span-2">
          {viewMode === "calendar" ? (
            <AppointmentCalendar
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
              onNewAppointment={handleNewAppointment}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="List" size={20} />
                  <span>All Appointments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <Empty
                    title="No appointments scheduled"
                    description="Start by scheduling your first appointment."
                    actionLabel="Schedule Appointment"
                    onAction={handleNewAppointment}
                    icon="Calendar"
                  />
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.Id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                            <ApperIcon name="Calendar" size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {getPatientName(appointment.patientId)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time} - {appointment.type}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getDoctorName(appointment.doctorId)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <StatusBadge status={appointment.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Clock" size={20} />
                <span>Today's Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <ApperIcon name="Calendar" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">No appointments today</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {todaysAppointments.map((appointment) => (
                    <div
                      key={appointment.Id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {appointment.time} - {getPatientName(appointment.patientId)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.type}
                        </div>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Zap" size={20} />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Calendar"
                onClick={handleNewAppointment}
              >
                Schedule New Appointment
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Search"
              >
                Find Available Slots
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Users"
              >
                View Patient List
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="FileText"
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;