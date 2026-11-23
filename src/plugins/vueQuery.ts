import type { VueQueryPluginOptions } from '@tanstack/vue-query';

export const vueQueryPluginOptions: VueQueryPluginOptions = {
   queryClientConfig: {
      defaultOptions: {
         queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
         },
      },
   },
};
