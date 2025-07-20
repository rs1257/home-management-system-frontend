import Loader from "@/components/Loader";
import { useInterval } from "@/util/useInterval";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import axios from "axios";

const loader = async () => {
	const { data, status } = await axios.get<{ id: string; title: string }[]>(
		"http://localhost:3005/api/tasks",
	);
	if (status !== 200) throw new Error("Failed to fetch inventory");

	return data;
};

export const Route = createFileRoute("/taskLists")({
	component: TaskLists,
	pendingComponent: Loader,
	loader,
});

function TaskLists() {
	const data = Route.useLoaderData();
	const router = useRouter();

	useInterval(() => {
		console.log("Invalidating task lists route");
		router.invalidate();
	}, 1000 * 60);

	const deleteTask = useMutation({
		mutationKey: ["delete-task"],
		mutationFn: async ({
			name,
		}: {
			name: string;
		}) => {
			const { data, status } = await axios.delete<[]>(
				"http://localhost:3005/api/tasks",
				{
					data: {
						name,
					},
				},
			);
			if (![200, 201].includes(status))
				throw new Error("Failed to fetch inventory");

			return data;
		},
		onSuccess: async () => {
			await router.invalidate();
		},
	});

	return (
		<div className="min-h-screen bg-background p-6 flex flex-col items-center">
			<h1 className="text-4xl text-text mb-4">Task Lists</h1>
			<div className="w-[70%] flex flex-col items-center shadow-lg bg-gray-700 rounded p-4">
				<h2 className="text-white text-2xl pb-3">Shopping</h2>
				{data?.map((task) => {
					return (
						<ul key={task.id} className="w-full p-2">
							<li className="shadow-lg bg-gray-800 text-white p-2 h-[3rem] rounded flex items-center transition hover:bg-gray-600">
								<input
									type="checkbox"
									className="rounded-full h-4 w-4 cursor-pointer bg-red-100 border-red-300 text-red-600 focus:ring-red-200"
								/>
								<span className="p-2 text-lg">{task.title}</span>
								<button
									type="button"
									onClick={async () => {
										deleteTask.mutate({
											name: task.title,
										});
									}}
									className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors max-w-24"
								>
									Delete
								</button>
							</li>
						</ul>
					);
				})}
			</div>
		</div>
	);
}
