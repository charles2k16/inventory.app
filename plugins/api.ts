import { apiClient } from '@/utils/api';

export default defineNuxtPlugin( () => {
  const config = useRuntimeConfig();
  apiClient.init( config.public.apiBase );

  return {
    provide: {
      api: apiClient,
    },
  };
} );
