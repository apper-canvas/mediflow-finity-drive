import appointmentData from "../mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  }

  async getAll() {
    await this.delay();
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay();
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    return appointment ? { ...appointment } : null;
  }

  async create(appointment) {
    await this.delay();
    const newAppointment = {
      ...appointment,
      Id: Math.max(...this.appointments.map(a => a.Id)) + 1,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Scheduled"
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await this.delay();
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...appointmentData };
      return { ...this.appointments[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deletedAppointment = this.appointments.splice(index, 1)[0];
      return { ...deletedAppointment };
    }
    return null;
  }

  async getByPatientId(patientId) {
    await this.delay();
    return this.appointments.filter(a => a.patientId === patientId.toString());
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    return this.appointments.filter(a => {
      const appointmentDate = new Date(a.date);
      return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
    });
  }

  async getTodaysAppointments() {
    const today = new Date().toISOString().split("T")[0];
    await this.delay();
    return this.appointments.filter(a => a.date === today);
  }
}

export default new AppointmentService();