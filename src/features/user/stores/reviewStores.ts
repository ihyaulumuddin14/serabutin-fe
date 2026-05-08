import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ReviewCredentials } from "../schemas/reviewSchemas";

export type ReviewDraft = ReviewCredentials

export type ReviewDraftsByJob = Record<string, ReviewDraft[]>;

type ReviewDraftState = {
	draftsByJob: ReviewDraftsByJob;
	upsertDraft: (jobId: string, draft: ReviewDraft) => void;
	clearJobDrafts: (jobId: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

export const useReviewDraftStore = create<ReviewDraftState>()(
	persist(
		(set, get) => ({
			draftsByJob: {},
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
			upsertDraft: (jobId, draft) => {
				const currentDrafts = get().draftsByJob[jobId] ?? [];
        const existingIndex = currentDrafts.findIndex(draftItem => draftItem.assignmentId === draft.assignmentId);

        if (existingIndex !== -1) {
          // Update existing draft
          currentDrafts[existingIndex] = {...currentDrafts[existingIndex], ...draft};
        } else {
          // Add new draft
          currentDrafts.push(draft);
        }

				set((state) => ({
					draftsByJob: { ...state.draftsByJob, [jobId]: currentDrafts },
				}));
			},
			clearJobDrafts: (jobId) =>
				set((state) => ({
          draftsByJob: { ...state.draftsByJob, [jobId]: [] },
        })),
		}),
		{
			name: "job-review-drafts",
			storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
		}
	)
);
