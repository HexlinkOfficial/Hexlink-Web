import { defineStore } from 'pinia';

export const useViewStore = defineStore({
    id: 'view',
    state: (): {
        view?: string,
        loading: boolean,
    } => ({
        loading: true
    }),
    persist: true,
    actions: {
        setView(view: string) {
            this.view = view;
            this.loading = true;
        },
        setLoading(state: boolean) {
            this.loading = state;
        },
    },
})