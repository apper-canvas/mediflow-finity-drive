import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const StaffGrid = ({ staff, onViewStaff, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case "doctor":
        return "Stethoscope";
      case "nurse":
        return "Heart";
      case "physical therapist":
        return "Activity";
      case "administrative assistant":
        return "FileText";
      default:
        return "User";
    }
  };

  const getAvailabilityStatus = (availability) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todaySchedule = availability.find(schedule => 
      schedule.day.toLowerCase() === today.toLowerCase()
    );
    
    if (!todaySchedule) {
      return { status: "Not Available", color: "text-red-600" };
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const [startTime, endTime] = todaySchedule.hours.split("-");

    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: "Available Now", color: "text-success" };
    } else {
      return { status: `Available ${todaySchedule.hours}`, color: "text-info" };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {staff.map((member) => {
        const availability = getAvailabilityStatus(member.availability);
        return (
          <Card key={member.Id} className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Profile Image or Avatar */}
                <div className="relative mb-4">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gradient-to-r from-primary to-secondary"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <ApperIcon 
                      name={getRoleIcon(member.role)} 
                      size={14} 
                      className="text-primary" 
                    />
                  </div>
                </div>

                {/* Name and Role */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-primary mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {member.specialization}
                </p>

                {/* Contact Info */}
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <div className="flex items-center justify-center space-x-1">
                    <ApperIcon name="Phone" size={12} />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <ApperIcon name="Mail" size={12} />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>

                {/* Availability Status */}
                <div className={`text-sm font-medium mb-4 ${availability.color}`}>
                  <div className="flex items-center justify-center space-x-1">
                    <ApperIcon name="Clock" size={14} />
                    <span>{availability.status}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Eye"
                    onClick={() => onViewStaff(member)}
                    className="flex-1"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="MessageSquare"
                    className="flex-1"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StaffGrid;