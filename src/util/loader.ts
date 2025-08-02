import { queryClient } from "@/integrations/tanstack-query/root-provider";
import axios from "axios";
import type { StoreApi, UseBoundStore } from "zustand";

interface Store<T> {
	replace: (item: T) => void;
}

export const createLoader = <T>(
	queryKey: string[],
	url: string,
	errorMessage: string,
	store: UseBoundStore<StoreApi<Store<T>>>,
) => {
	return async () => {
		const query = queryClient.prefetchQuery({
			queryKey,
			queryFn: async () => {
				const { data, status } = await axios.get<T>(url);
				if (status !== 200) throw new Error(errorMessage);

				store.getState().replace(data);
				return data;
			},
		});
		return query;
	};
};
