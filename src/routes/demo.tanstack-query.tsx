import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios, { type AxiosResponse } from "axios";

export const Route = createFileRoute("/demo/tanstack-query")({
	component: TanStackQueryDemo,
});

function TanStackQueryDemo() {
	const { data } = useQuery({
		queryKey: ["people"],
		queryFn: async () => {
			const { data } = await axios
				.get<AxiosResponse<{ name: string }[]>>("http://msw-test.com/api/data")
				.then((res) => res.data);
			console.log("Response from server:", data);
			return data;
		},
		initialData: [],
	});

	return (
		<div className="p-4">
			<h1 className="text-2xl mb-4">People list</h1>
			<ul>
				{data.map((person) => (
					<li key={person.name}>{person.name}</li>
				))}
			</ul>
		</div>
	);
}
