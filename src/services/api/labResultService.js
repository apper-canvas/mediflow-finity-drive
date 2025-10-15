const STORAGE_KEY = 'mediflow_lab_results';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

class LabResultService {
  constructor() {
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }

  getLabResults() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error reading lab results:', error);
      return [];
    }
  }

  saveLabResults(results) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      throw new Error('Failed to save lab results. Storage may be full.');
    }
  }

  validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('File type not supported. Please upload PDF, JPG, or PNG files.');
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async create(patientId, file, notes = '') {
    await this.delay(300);
    
    this.validateFile(file);
    
    try {
      const base64Data = await this.fileToBase64(file);
      const results = this.getLabResults();
      
      const newResult = {
        Id: results.length > 0 ? Math.max(...results.map(r => r.Id)) + 1 : 1,
        PatientId: parseInt(patientId),
        FileName: file.name,
        FileType: file.type,
        FileSize: file.size,
        FileData: base64Data,
        UploadDate: new Date().toISOString(),
        Notes: notes
      };
      
      results.push(newResult);
      this.saveLabResults(results);
      
      return { ...newResult, FileData: undefined };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getByPatientId(patientId) {
    await this.delay(200);
    const results = this.getLabResults();
    return results
      .filter(r => r.PatientId === parseInt(patientId))
      .map(r => ({ ...r, FileData: undefined }))
      .sort((a, b) => new Date(b.UploadDate) - new Date(a.UploadDate));
  }

  async getById(id) {
    await this.delay(100);
    const results = this.getLabResults();
    const result = results.find(r => r.Id === parseInt(id));
    if (!result) {
      throw new Error('Lab result not found');
    }
    return { ...result };
  }

  async delete(id) {
    await this.delay(200);
    const results = this.getLabResults();
    const index = results.findIndex(r => r.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Lab result not found');
    }
    
    results.splice(index, 1);
    this.saveLabResults(results);
    return true;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

const labResultService = new LabResultService();
export default labResultService;