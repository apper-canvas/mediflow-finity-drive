import admissionData from '../mockData/admissions.json';

class AdmissionService {
  constructor() {
    this.admissions = [...admissionData];
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  }

  async getAll() {
    await this.delay();
    return [...this.admissions];
  }

  async getById(id) {
    await this.delay();
    const admission = this.admissions.find(a => a.Id === parseInt(id));
    return admission ? { ...admission } : null;
  }

  async getByPatientId(patientId) {
    await this.delay();
    return this.admissions.filter(a => a.patientId === parseInt(patientId));
  }

  async getActiveAdmissions() {
    await this.delay();
    return this.admissions.filter(a => a.status === 'Admitted');
  }

  async getDischargedAdmissions() {
    await this.delay();
    return this.admissions.filter(a => a.status === 'Discharged');
  }

  async create(admission) {
    await this.delay();
    const newAdmission = {
      ...admission,
      Id: Math.max(...this.admissions.map(a => a.Id), 0) + 1,
      admissionDate: admission.admissionDate || new Date().toISOString().split('T')[0],
      status: 'Admitted',
      dischargeDate: null,
      dischargeSummary: null,
      followUpInstructions: null
    };
    this.admissions.push(newAdmission);
    return { ...newAdmission };
  }

  async update(id, admissionData) {
    await this.delay();
    const index = this.admissions.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.admissions[index] = { ...this.admissions[index], ...admissionData };
      return { ...this.admissions[index] };
    }
    return null;
  }

  async discharge(id, dischargeData) {
    await this.delay();
    const index = this.admissions.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.admissions[index] = {
        ...this.admissions[index],
        status: 'Discharged',
        dischargeDate: dischargeData.dischargeDate || new Date().toISOString().split('T')[0],
        dischargeSummary: dischargeData.dischargeSummary,
        followUpInstructions: dischargeData.followUpInstructions,
        followUpDate: dischargeData.followUpDate
      };
      return { ...this.admissions[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.admissions.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deletedAdmission = this.admissions.splice(index, 1)[0];
      return { ...deletedAdmission };
    }
    return null;
  }

  async search(query) {
    await this.delay();
    if (!query || typeof query !== 'string') {
      return [...this.admissions];
    }
    
    const searchTerm = query.toLowerCase();
    return this.admissions.filter(admission =>
      admission.roomNumber?.toLowerCase().includes(searchTerm) ||
      admission.department?.toLowerCase().includes(searchTerm) ||
      admission.admissionReason?.toLowerCase().includes(searchTerm)
    );
  }
}

export default new AdmissionService();