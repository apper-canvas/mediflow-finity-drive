import patientData from "../mockData/patients.json";

class PatientService {
  constructor() {
    this.patients = [...patientData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  }

  async getAll() {
    await this.delay();
    return [...this.patients];
  }

  async getById(id) {
    await this.delay();
    const patient = this.patients.find(p => p.Id === parseInt(id));
    return patient ? { ...patient } : null;
  }

  async create(patient) {
    await this.delay();
    const newPatient = {
      ...patient,
      Id: Math.max(...this.patients.map(p => p.Id)) + 1,
      registrationDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async update(id, patientData) {
    await this.delay();
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...patientData };
      return { ...this.patients[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      const deletedPatient = this.patients.splice(index, 1)[0];
      return { ...deletedPatient };
    }
    return null;
  }

  async search(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.patients.filter(patient =>
      patient.firstName.toLowerCase().includes(searchTerm) ||
      patient.lastName.toLowerCase().includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm)
    );
  }
}

export default new PatientService();