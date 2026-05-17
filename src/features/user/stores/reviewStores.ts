import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ReviewCredentials } from "../schemas/reviewSchemas";

export type ReviewDraft = ReviewCredentials;

export type ReviewDraftsByAssignment = Record<string, ReviewDraft[]>;

type ReviewDraftState = {
  draftsByAssignmentId: ReviewDraftsByAssignment;
  upsertDraft: (assignmentId: string, draft: ReviewDraft) => void;
  clearJobDrafts: (assignmentIds: string | string[]) => void;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

export const useReviewDraftStore = create<ReviewDraftState>()(
  persist(
    (set, get) => ({
      draftsByAssignmentId: {},
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      upsertDraft: (assignmentId, draft) => {
        const currentDrafts = get().draftsByAssignmentId[assignmentId] ?? [];
        const existingIndex = currentDrafts.findIndex(
          (draftItem) => draftItem.assignmentId === draft.assignmentId,
        );

        if (existingIndex !== -1) {
          // Update existing draft
          currentDrafts[existingIndex] = {
            ...currentDrafts[existingIndex],
            ...draft,
          };
        } else {
          // Add new draft
          currentDrafts.push(draft);
        }

        set((state) => ({
          draftsByAssignmentId: {
            ...state.draftsByAssignmentId,
            [assignmentId]: currentDrafts,
          },
        }));
      },
      clearJobDrafts: (assignmentIds) =>
        set((state) => {
          const ids = Array.isArray(assignmentIds)
            ? assignmentIds
            : [assignmentIds];
          const nextDrafts = { ...state.draftsByAssignmentId };
          ids.forEach((id) => {
            delete nextDrafts[id];
          });
          return { draftsByAssignmentId: nextDrafts };
        }),
    }),
    {
      name: "job-review-drafts",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
