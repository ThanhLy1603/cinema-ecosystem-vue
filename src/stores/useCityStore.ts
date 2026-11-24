import { defineStore } from 'pinia';

const STORAGE_KEY: string = 'cinema-selected-city';

interface CityState {
   city: string;
}

function readStoredCity(): string {
   try {
      return window.localStorage.getItem(STORAGE_KEY) ?? '';
   } catch {
      return '';
   }
}

function writeStoredCity(city: string): void {
   try {
      window.localStorage.setItem(STORAGE_KEY, city);
   } catch {
      return;
   }
}

export const useCityStore = defineStore('city', {
   state: (): CityState => ({
      city: readStoredCity(),
   }),

   actions: {
      setCity(city: string): void {
         this.city = city;
         writeStoredCity(city);
      },
   },
});
