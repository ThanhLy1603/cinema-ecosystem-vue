<script setup lang="ts">
import { MapPin, Phone, Save } from 'lucide-vue-next';
import { ref } from 'vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseSelectField from '@/components/ui/BaseSelectField.vue';
import BaseTextField from '@/components/ui/BaseTextField.vue';
import type { CinemaDetail, CinemaRequest, CinemaStatus, Facility } from '@/types/cinema/cinema';
import { CINEMA_STATUS_OPTIONS } from '../utils/labels';
import { buildCityOptions } from '../utils/provinces';
import {
   emptyToNull,
   parseCoordinate,
   validateCoordinates,
   validateHotline,
   validateRequiredSelection,
   validateRequiredText,
   type CoordinateErrors,
} from '../utils/validation';
import FacilityPicker from './FacilityPicker.vue';

interface CinemaFormProps {
   initialCinema?: CinemaDetail;
   facilities: Facility[];
   canEditStatus: boolean;
   isSubmitting: boolean;
   submitLabel: string;
   errorMessage?: string;
   successMessage?: string;
   serverFieldErrors?: Record<string, string>;
}

interface CinemaFieldErrors {
   name?: string;
   city?: string;
   address?: string;
   phone?: string;
   latitude?: string;
   longitude?: string;
   status?: string;
}

const props = withDefaults(defineProps<CinemaFormProps>(), {
   initialCinema: undefined,
   errorMessage: undefined,
   successMessage: undefined,
   serverFieldErrors: () => ({}),
});

const emit = defineEmits<{ submit: [cinemaRequest: CinemaRequest] }>();

function coordinateToText(coordinate: number | null | undefined): string {
   return coordinate === null || coordinate === undefined ? '' : String(coordinate);
}

const name = ref<string>(props.initialCinema?.name ?? '');
const city = ref<string>(props.initialCinema?.city ?? '');
const address = ref<string>(props.initialCinema?.address ?? '');
const phone = ref<string>(props.initialCinema?.phone ?? '');
const latitude = ref<string>(coordinateToText(props.initialCinema?.latitude));
const longitude = ref<string>(coordinateToText(props.initialCinema?.longitude));
const status = ref<string>(props.initialCinema?.status ?? 'ACTIVE');
const facilityIds = ref<number[]>(props.initialCinema?.facilities.map((facility) => facility.id) ?? []);
const fieldErrors = ref<CinemaFieldErrors>({});

const cityOptions = buildCityOptions(props.initialCinema?.city);

function handleSubmit(): void {
   const coordinateErrors: CoordinateErrors = validateCoordinates(latitude.value, longitude.value);
   const nextFieldErrors: CinemaFieldErrors = {
      name: validateRequiredText(name.value, 'Vui lòng nhập tên rạp', 255),
      city: validateRequiredSelection(city.value, 'Vui lòng chọn tỉnh/thành phố'),
      address: validateRequiredText(address.value, 'Vui lòng nhập địa chỉ', 500),
      phone: validateHotline(phone.value),
      latitude: coordinateErrors.latitude,
      longitude: coordinateErrors.longitude,
      status: validateRequiredSelection(status.value, 'Vui lòng chọn trạng thái'),
   };
   fieldErrors.value = nextFieldErrors;
   if (Object.values(nextFieldErrors).some((message) => message !== undefined)) {
      return;
   }
   emit('submit', {
      name: name.value.trim(),
      city: city.value,
      address: address.value.trim(),
      phone: emptyToNull(phone.value),
      latitude: parseCoordinate(latitude.value),
      longitude: parseCoordinate(longitude.value),
      status: status.value as CinemaStatus,
      facilityIds: facilityIds.value,
   });
}
</script>

<template>
   <form class="space-y-6" novalidate @submit.prevent="handleSubmit">
      <BaseAlert v-if="errorMessage" variant="error">{{ errorMessage }}</BaseAlert>
      <BaseAlert v-if="successMessage" variant="success">{{ successMessage }}</BaseAlert>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
         <div class="sm:col-span-2">
            <BaseTextField
               id="cinema-name"
               v-model="name"
               label="Tên cụm rạp"
               :max-length="255"
               :error="fieldErrors.name ?? serverFieldErrors.name"
            />
         </div>
         <BaseSelectField
            id="cinema-city"
            v-model="city"
            label="Tỉnh/Thành phố"
            :options="cityOptions"
            :error="fieldErrors.city ?? serverFieldErrors.city"
         />
         <BaseTextField
            id="cinema-phone"
            v-model="phone"
            label="Số hotline"
            type="tel"
            :icon="Phone"
            optional
            :error="fieldErrors.phone ?? serverFieldErrors.phone"
         />
         <div class="sm:col-span-2">
            <BaseTextField
               id="cinema-address"
               v-model="address"
               label="Địa chỉ"
               :icon="MapPin"
               :max-length="500"
               :error="fieldErrors.address ?? serverFieldErrors.address"
            />
         </div>
         <BaseTextField
            id="cinema-latitude"
            v-model="latitude"
            label="Vĩ độ"
            optional
            placeholder="10.7715"
            :error="fieldErrors.latitude ?? serverFieldErrors.latitude"
         />
         <BaseTextField
            id="cinema-longitude"
            v-model="longitude"
            label="Kinh độ"
            optional
            placeholder="106.7042"
            :error="fieldErrors.longitude ?? serverFieldErrors.longitude"
         />
         <BaseSelectField
            id="cinema-status"
            v-model="status"
            label="Trạng thái"
            :options="CINEMA_STATUS_OPTIONS"
            :disabled="!canEditStatus"
            :error="fieldErrors.status"
         />
         <p v-if="!canEditStatus" class="self-end text-sm text-ink-500">
            Chỉ quản trị viên mới được đổi trạng thái cụm rạp.
         </p>
      </div>

      <div class="space-y-3">
         <h3 class="text-sm font-semibold text-ink-800">Tiện ích</h3>
         <FacilityPicker v-model="facilityIds" :facilities="facilities" />
      </div>

      <BaseButton type="submit" :is-loading="isSubmitting" :icon="Save">{{ submitLabel }}</BaseButton>
   </form>
</template>
