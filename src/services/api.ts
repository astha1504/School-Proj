const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async login(query: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchStudents() {
    try {
      const res = await fetch(`${API_BASE_URL}/students`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async addStudent(studentData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchClasses() {
    try {
      const res = await fetch(`${API_BASE_URL}/classes`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchSubjects() {
    try {
      const res = await fetch(`${API_BASE_URL}/subjects`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchStaff() {
    try {
      const res = await fetch(`${API_BASE_URL}/staff`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async recordPayment(invoiceId: string, amount: number, paymentMethod: string, gateway: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, paymentMethod, paymentGateway: gateway })
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};
