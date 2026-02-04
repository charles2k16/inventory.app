export const useApi = () => {
  const config = useRuntimeConfig();
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  };

  return {
    // Products
    async getProducts(params = {}) {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(
        `${config.public.apiBase}/products?${query}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    },

    async getProduct(id: string) {
      const response = await fetch(
        `${config.public.apiBase}/products/${id}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    },

    async createProduct(data: any) {
      const response = await fetch(
        `${config.public.apiBase}/products`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
        }
      );
      return handleResponse(response);
    },

    // Sales
    async getSales(params = {}) {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(
        `${config.public.apiBase}/sales?${query}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    },

    async createSale(data: any) {
      const response = await fetch(
        `${config.public.apiBase}/sales`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
        }
      );
      return handleResponse(response);
    },

    // Dashboard
    async getDashboardStats() {
      const response = await fetch(
        `${config.public.apiBase}/dashboard/stats`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    },

    async getSalesChart(period = 'week') {
      const response = await fetch(
        `${config.public.apiBase}/dashboard/sales-chart?period=${period}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    },

    // Lenders
    async getLenders(params = {}) {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(
        `${config.public.apiBase}/lenders?${query}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    },

    // Stock Reports
    async getStockReports(params = {}) {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(
        `${config.public.apiBase}/stock-reports?${query}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    }
  };
};
