import prescriptionData from '../mockData/prescriptions.json';

let prescriptions = [...prescriptionData];

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class PrescriptionService {
  async getAll() {
    await delay();
    return [...prescriptions];
  }

  async getById(id) {
    await delay();
    const prescription = prescriptions.find(p => p.Id === parseInt(id));
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    return { ...prescription };
  }

  async getByPatientId(patientId) {
    await delay();
    return prescriptions.filter(p => p.patientId === parseInt(patientId));
  }

  async getDueForRefill(daysAhead = 7) {
    await delay();
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysAhead);

    return prescriptions.filter(p => {
      if (p.status !== 'Active') return false;
      const refillDate = new Date(p.refillDate);
      return refillDate >= today && refillDate <= futureDate;
    });
  }

  async create(prescription) {
    await delay();
    const newPrescription = {
      ...prescription,
      Id: Math.max(...prescriptions.map(p => p.Id), 0) + 1,
      prescribedDate: prescription.prescribedDate || new Date().toISOString().split('T')[0],
      status: prescription.status || 'Active'
    };
    prescriptions.push(newPrescription);
    return { ...newPrescription };
  }

  async update(id, prescriptionData) {
    await delay();
    const index = prescriptions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Prescription not found');
    }
    prescriptions[index] = {
      ...prescriptions[index],
      ...prescriptionData,
      Id: prescriptions[index].Id
    };
    return { ...prescriptions[index] };
  }

  async delete(id) {
    await delay();
    const index = prescriptions.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Prescription not found');
    }
    prescriptions.splice(index, 1);
    return true;
  }

  async search(query) {
    await delay();
    if (!query || query.trim() === '') {
      return [...prescriptions];
    }
    const searchTerm = query.toLowerCase();
    return prescriptions.filter(p =>
      p.medicationName.toLowerCase().includes(searchTerm) ||
      p.prescribedBy.toLowerCase().includes(searchTerm) ||
      p.dosage.toLowerCase().includes(searchTerm)
    );
  }
}

export default new PrescriptionService();