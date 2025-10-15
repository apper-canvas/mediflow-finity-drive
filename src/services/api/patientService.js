import patientData from "../mockData/patients.json";

class PatientService {
  constructor() {
    this.patients = [...patientData];
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
      status: "Active",
      height: patient.height || "",
      weight: patient.weight || "",
      allergies: patient.allergies || [],
      existingConditions: patient.existingConditions || [],
      currentMedications: patient.currentMedications || [],
      pastSurgeries: patient.pastSurgeries || [],
      familyHistory: patient.familyHistory || "",
      primaryPhysician: patient.primaryPhysician || ""
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

async update(id, patientData) {
    await this.delay();
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      this.patients[index] = {
        ...this.patients[index],
        ...patientData,
        height: patientData.height || this.patients[index].height || "",
        weight: patientData.weight || this.patients[index].weight || "",
        allergies: patientData.allergies || this.patients[index].allergies || [],
        existingConditions: patientData.existingConditions || this.patients[index].existingConditions || [],
        currentMedications: patientData.currentMedications || this.patients[index].currentMedications || [],
        pastSurgeries: patientData.pastSurgeries || this.patients[index].pastSurgeries || [],
        familyHistory: patientData.familyHistory || this.patients[index].familyHistory || "",
        primaryPhysician: patientData.primaryPhysician || this.patients[index].primaryPhysician || ""
      };
      return { ...this.patients[index] };
    }
    return null;
  }

  async updateStatus(id, status, admissionId = null) {
    await this.delay();
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      this.patients[index].status = status;
      this.patients[index].admissionStatus = status;
      if (admissionId) {
        this.patients[index].currentAdmissionId = admissionId;
      }
      if (status === 'Discharged') {
        this.patients[index].lastDischargeDate = new Date().toISOString().split('T')[0];
        this.patients[index].currentAdmissionId = null;
      }
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
    if (!query || typeof query !== 'string') {
      return [...this.patients];
    }
    
    const searchTerm = query.toLowerCase();
    return this.patients.filter(patient =>
      patient.firstName?.toLowerCase().includes(searchTerm) ||
      patient.lastName?.toLowerCase().includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm) ||
      patient.phone?.includes(searchTerm)
    );
  }
}

export default new PatientService();