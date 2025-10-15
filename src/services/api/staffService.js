import staffData from "../mockData/staff.json";

class StaffService {
  constructor() {
    this.staff = [...staffData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  }

  async getAll() {
    await this.delay();
    return [...this.staff];
  }

  async getById(id) {
    await this.delay();
    const member = this.staff.find(s => s.Id === parseInt(id));
    return member ? { ...member } : null;
  }

  async create(staffMember) {
    await this.delay();
    const newStaffMember = {
      ...staffMember,
      Id: Math.max(...this.staff.map(s => s.Id)) + 1
    };
    this.staff.push(newStaffMember);
    return { ...newStaffMember };
  }

  async update(id, staffData) {
    await this.delay();
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      this.staff[index] = { ...this.staff[index], ...staffData };
      return { ...this.staff[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      const deletedStaffMember = this.staff.splice(index, 1)[0];
      return { ...deletedStaffMember };
    }
    return null;
  }

  async getDoctors() {
    await this.delay();
    return this.staff.filter(s => s.role === "Doctor");
  }

  async getByRole(role) {
    await this.delay();
    return this.staff.filter(s => s.role === role);
  }
}

export default new StaffService();