/**
 * Composable for API calls
 * Uses the global apiClient for automatic header/auth handling
 */
export const useApi = () => {
  const { $api } = useNuxtApp();

  return {
    // Products
    getProducts: ( params = {} ) => $api.get( '/products', params ),
    getProduct: ( id: string ) => $api.get( `/products/${ id }` ),
    createProduct: ( data: any ) => $api.post( '/products', data ),
    updateProduct: ( id: string, data: any ) => $api.put( `/products/${ id }`, data ),
    deleteProduct: ( id: string ) => $api.delete( `/products/${ id }` ),

    // Sales
    getSales: ( params = {} ) => $api.get( '/sales', params ),
    getSale: ( id: string ) => $api.get( `/sales/${ id }` ),
    createSale: ( data: any ) => $api.post( '/sales', data ),
    updateSale: ( id: string, data: any ) => $api.put( `/sales/${ id }`, data ),

    // Dashboard
    getDashboardStats: () => $api.get( '/dashboard/stats' ),
    getSalesChart: ( period = 'week' ) => $api.get( '/dashboard/sales-chart', { period } ),

    // Lenders
    getLenders: ( params = {} ) => $api.get( '/lenders', params ),
    createLender: ( data: any ) => $api.post( '/lenders', data ),
    updateLender: ( id: string, data: any ) => $api.put( `/lenders/${ id }`, data ),

    // Stock Reports
    getStockReports: ( params = {} ) => $api.get( '/stock-reports', params ),
    getStockReport: ( id: string ) => $api.get( `/stock-reports/${ id }` ),
    createStockReport: ( data: any ) => $api.post( '/stock-reports', data ),

    // Returns
    getReturns: ( params = {} ) => $api.get( '/returns', params ),
    createReturn: ( data: any ) => $api.post( '/returns', data ),

    // File uploads
    uploadFile: ( endpoint: string, formData: FormData ) => $api.uploadFile( endpoint, formData ),
  };
};
