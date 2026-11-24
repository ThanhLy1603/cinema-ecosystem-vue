import { computed, shallowRef, type ComputedRef } from 'vue';
import type { SeatMapDraft } from '../utils/seatMapEditing';

const MAX_HISTORY_SIZE: number = 100;

interface SeatMapHistoryState {
   present: SeatMapDraft;
   past: SeatMapDraft[];
   future: SeatMapDraft[];
   strokeStart: SeatMapDraft | null;
}

export interface SeatMapDraftController {
   seatMapDraft: ComputedRef<SeatMapDraft>;
   canUndo: ComputedRef<boolean>;
   canRedo: ComputedRef<boolean>;
   reset: (seatMapDraft: SeatMapDraft) => void;
   beginStroke: () => void;
   apply: (update: (seatMapDraft: SeatMapDraft) => SeatMapDraft) => void;
   endStroke: () => void;
   undo: () => void;
   redo: () => void;
}

function pushHistory(past: SeatMapDraft[], seatMapDraft: SeatMapDraft): SeatMapDraft[] {
   return [...past, seatMapDraft].slice(-MAX_HISTORY_SIZE);
}

export function useSeatMapDraft(initialSeatMapDraft: SeatMapDraft): SeatMapDraftController {
   const historyState = shallowRef<SeatMapHistoryState>({
      present: initialSeatMapDraft,
      past: [],
      future: [],
      strokeStart: null,
   });

   function reset(seatMapDraft: SeatMapDraft): void {
      historyState.value = { present: seatMapDraft, past: [], future: [], strokeStart: null };
   }

   function beginStroke(): void {
      historyState.value = { ...historyState.value, strokeStart: historyState.value.present };
   }

   function apply(update: (seatMapDraft: SeatMapDraft) => SeatMapDraft): void {
      const state: SeatMapHistoryState = historyState.value;
      const nextSeatMapDraft: SeatMapDraft = update(state.present);
      if (nextSeatMapDraft === state.present) {
         return;
      }
      if (state.strokeStart) {
         historyState.value = { ...state, present: nextSeatMapDraft };
         return;
      }
      historyState.value = {
         ...state,
         present: nextSeatMapDraft,
         past: pushHistory(state.past, state.present),
         future: [],
      };
   }

   function endStroke(): void {
      const state: SeatMapHistoryState = historyState.value;
      if (!state.strokeStart) {
         return;
      }
      if (state.strokeStart === state.present) {
         historyState.value = { ...state, strokeStart: null };
         return;
      }
      historyState.value = {
         ...state,
         strokeStart: null,
         past: pushHistory(state.past, state.strokeStart),
         future: [],
      };
   }

   function undo(): void {
      const state: SeatMapHistoryState = historyState.value;
      const previousSeatMapDraft: SeatMapDraft | undefined = state.past[state.past.length - 1];
      if (!previousSeatMapDraft) {
         return;
      }
      historyState.value = {
         present: previousSeatMapDraft,
         past: state.past.slice(0, -1),
         future: [state.present, ...state.future],
         strokeStart: null,
      };
   }

   function redo(): void {
      const state: SeatMapHistoryState = historyState.value;
      const nextSeatMapDraft: SeatMapDraft | undefined = state.future[0];
      if (!nextSeatMapDraft) {
         return;
      }
      historyState.value = {
         present: nextSeatMapDraft,
         past: pushHistory(state.past, state.present),
         future: state.future.slice(1),
         strokeStart: null,
      };
   }

   return {
      seatMapDraft: computed(() => historyState.value.present),
      canUndo: computed(() => historyState.value.past.length > 0),
      canRedo: computed(() => historyState.value.future.length > 0),
      reset,
      beginStroke,
      apply,
      endStroke,
      undo,
      redo,
   };
}
