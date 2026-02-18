/**
 * Global API client with automatic authorization header handling
 * No need to manually add Authorization header to every request
 */

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

export const apiClient = {
  baseURL: '',

  /**
   * Initialize the API client with the base URL
   */
  init ( baseURL: string ) {
    this.baseURL = baseURL;
  },

  /**
   * Get authorization headers
   */
  _getHeaders ( headers?: HeadersInit ): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem( 'token' ) : null;
    return {
      'Content-Type': 'application/json',
      ...( token && { Authorization: `Bearer ${ token }` } ),
      ...headers,
    };
  },

  /**
   * Build URL with query parameters
   */
  _buildUrl ( endpoint: string, params?: Record<string, any> ): string {
    // Ensure baseURL ends with / and endpoint starts with /
    const base = this.baseURL.endsWith( '/' ) ? this.baseURL : this.baseURL + '/';
    const path = endpoint.startsWith( '/' ) ? endpoint.slice( 1 ) : endpoint;
    const fullUrl = base + path;

    const url = new URL( fullUrl );
    if ( params ) {
      Object.entries( params ).forEach( ( [ key, value ] ) => {
        if ( value !== null && value !== undefined ) {
          url.searchParams.append( key, String( value ) );
        }
      } );
    }
    return url.toString();
  },

  /**
   * Handle API response
   */
  async _handleResponse<T> ( response: Response ): Promise<T> {
    const contentType = response.headers.get( 'content-type' );
    const isJson = contentType?.includes( 'application/json' );

    let data;
    if ( isJson ) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if ( !response.ok ) {
      // Session expired or unauthorized — clear token and redirect to login
      if ( response.status === 401 && typeof window !== 'undefined' ) {
        localStorage.removeItem( 'token' );
        localStorage.removeItem( 'user' );
        window.location.href = '/login';
      }
      const errorMessage = isJson ? data.message || data.error : data;
      throw new Error( errorMessage || `HTTP ${ response.status }: ${ response.statusText }` );
    }

    return data;
  },

  /**
   * Generic request method
   */
  async request<T = any> ( endpoint: string, options: RequestOptions = {} ): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this._buildUrl( endpoint, params );

    const response = await fetch( url, {
      ...fetchOptions,
      headers: this._getHeaders( fetchOptions.headers ),
    } );

    return this._handleResponse<T>( response );
  },

  /**
   * GET request
   */
  async get<T = any> ( endpoint: string, params?: Record<string, any> ): Promise<T> {
    return this.request<T>( endpoint, {
      method: 'GET',
      params,
    } );
  },

  /**
   * POST request
   */
  async post<T = any> (
    endpoint: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<T> {
    return this.request<T>( endpoint, {
      method: 'POST',
      body: body ? JSON.stringify( body ) : undefined,
      params,
    } );
  },

  /**
   * PUT request
   */
  async put<T = any> (
    endpoint: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<T> {
    return this.request<T>( endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify( body ) : undefined,
      params,
    } );
  },

  /**
   * PATCH request
   */
  async patch<T = any> (
    endpoint: string,
    body?: any,
    params?: Record<string, any>
  ): Promise<T> {
    return this.request<T>( endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify( body ) : undefined,
      params,
    } );
  },

  /**
   * DELETE request
   */
  async delete<T = any> ( endpoint: string, params?: Record<string, any> ): Promise<T> {
    return this.request<T>( endpoint, {
      method: 'DELETE',
      params,
    } );
  },

  /**
   * Upload file (multipart/form-data)
   */
  async uploadFile<T = any> ( endpoint: string, formData: FormData ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem( 'token' ) : null;

    const response = await fetch( this._buildUrl( endpoint ), {
      method: 'POST',
      body: formData,
      headers: {
        ...( token && { Authorization: `Bearer ${ token }` } ),
      },
    } );

    return this._handleResponse<T>( response );
  },
};
