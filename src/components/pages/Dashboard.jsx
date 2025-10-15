import { useState, useEffect } from "react";
import { format } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import staffService from "@/services/api/staffService";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientsData, appointmentsData, staffData, todaysData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        staffService.getAll(),
        appointmentService.getTodaysAppointments()
      ]);

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setStaff(staffData);
      setTodaysAppointments(todaysData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === "Active").length;
  const totalAppointments = todaysAppointments.length;
  const completedAppointments = todaysAppointments.filter(a => a.status === "Completed").length;
  const scheduledAppointments = todaysAppointments.filter(a => a.status === "Scheduled").length;
  const availableDoctors = staff.filter(s => s.role === "Doctor").length;

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.Id.toString() === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    const doctor = staff.find(s => s.Id.toString() === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening at your medical facility today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12% from last month"
        />
        <StatCard
          title="Today's Appointments"
          value={totalAppointments}
          icon="Calendar"
          color="info"
          trend="up"
          trendValue="+8% from yesterday"
        />
        <StatCard
          title="Completed Today"
          value={completedAppointments}
          icon="CheckCircle"
          color="success"
        />
        <StatCard
          title="Available Doctors"
          value={availableDoctors}
          icon="UserCheck"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={20} />
                <span>Today's Schedule</span>
              </CardTitle>
              <div className="text-sm text-gray-500">
                {format(new Date(), "MMMM d, yyyy")}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length === 0 ? (
              <Empty
                title="No appointments today"
                description="There are no scheduled appointments for today."
                actionLabel="Schedule Appointment"
                icon="Calendar"
              />
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {todaysAppointments.map((appointment) => (
                  <div
                    key={appointment.Id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                        <ApperIcon name="Clock" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {getPatientName(appointment.patientId)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {appointment.time} - {appointment.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          Dr. {getDoctorName(appointment.doctorId)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={appointment.status} />
                      <Button variant="ghost" size="sm" icon="Eye">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Zap" size={20} />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant="primary"
                className="h-20 flex-col space-y-2"
                icon="UserPlus"
              >
                <span>Add Patient</span>
              </Button>
              <Button
                variant="secondary"
                className="h-20 flex-col space-y-2"
                icon="Calendar"
              >
                <span>Schedule</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                icon="Search"
              >
                <span>Find Patient</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                icon="FileText"
              >
                <span>Reports</span>
              </Button>
            </div>

            {/* Recent Patients */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Patients</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {patients.slice(0, 5).map((patient) => (
                  <div
                    key={patient.Id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.phone}
                      </div>
                    </div>
                    <StatusBadge status={patient.status} type="patient" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="BarChart3" size={20} />
            <span>Weekly Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{scheduledAppointments}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">{completedAppointments}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-1">{activePatients}</div>
              <div className="text-sm text-gray-600">Active Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info mb-1">{availableDoctors}</div>
              <div className="text-sm text-gray-600">Available Staff</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;