import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useMutate = <T,>(
	mutationKey: string[],
	method: string,
	url: string,
	errorMessage: string,
	onSuccess: () => Promise<void>,
) => {
	return useMutation({
		mutationKey,
		mutationFn: async (postData: T) => {
			const { data, status } = await axios<T>({
				method,
				url,
				data: postData,
			});

			if (![200, 201].includes(status)) throw new Error(errorMessage);

			return data;
		},
		onSuccess,
	});
};
