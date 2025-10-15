import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const AppointmentCalendar = ({ appointments = [], onAppointmentClick, onNewAppointment }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const getAppointmentsForDay = (date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date));
  };

  const getAppointmentForTimeSlot = (date, time) => {
    return appointments.find(apt => 
      isSameDay(new Date(apt.date), date) && apt.time === time
    );
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={24} />
            <span>Appointment Calendar</span>
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon="ChevronLeft"
                onClick={goToPreviousWeek}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="ChevronRight"
                onClick={goToNextWeek}
              />
            </div>
            
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={onNewAppointment}
            >
              New Appointment
            </Button>
          </div>
        </div>
        
        <div className="text-lg font-semibold text-gray-900">
          {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header with days */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-500">Time</span>
              </div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-medium text-gray-900">
                    {format(day, "EEE")}
                  </div>
                  <div className={`text-lg font-semibold mt-1 ${
                    isSameDay(day, new Date()) ? "text-primary" : "text-gray-700"
                  }`}>
                    {format(day, "d")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getAppointmentsForDay(day).length} appointments
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots and appointments */}
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100">
                  <div className="p-3 bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-600">
                    {timeSlot}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const appointment = getAppointmentForTimeSlot(day, timeSlot);
                    return (
                      <div
                        key={`${timeSlot}-${dayIndex}`}
                        className="p-2 border-r border-gray-100 last:border-r-0 min-h-[60px] hover:bg-gray-50 cursor-pointer"
                        onClick={() => !appointment && onNewAppointment && onNewAppointment(day, timeSlot)}
                      >
                        {appointment && (
                          <div
                            className="bg-gradient-to-r from-primary to-secondary text-white p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentClick && onAppointmentClick(appointment);
                            }}
                          >
                            <div className="font-medium truncate">
                              Patient ID: {appointment.patientId}
                            </div>
                            <div className="truncate opacity-90">
                              {appointment.type}
                            </div>
                            <div className="mt-1">
                              <StatusBadge status={appointment.status} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;