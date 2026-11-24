import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { getFacilities } from '@/api/cinema/cinemaApi';
import type { Facility } from '@/types/cinema/cinema';
import { ADMIN_FACILITIES_KEY } from '../utils/queryKeys';

export function useFacilities(deleted: MaybeRefOrGetter<boolean> = false): UseQueryReturnType<Facility[], Error> {
   return useQuery<Facility[]>({
      queryKey: computed(() => [...ADMIN_FACILITIES_KEY, toValue(deleted)]),
      queryFn: () => getFacilities(toValue(deleted)),
   });
}
