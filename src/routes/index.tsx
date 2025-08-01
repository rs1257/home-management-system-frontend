import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

const cards = [
	{ name: "Inventory", info: "You have 5 items below the threshold" },
	{ name: "Task Lists", info: "You have 2 outstanding tasks" },
	{ name: "Wish List", info: "You have 10 items on your wishlist" },
	{ name: "Money Tracker", info: "You have a total of £20" },
	{ name: "Expenses", info: "This month you will need to pay £10" },
];

function RouteComponent() {
	return (
		<div className="p-5 grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
			{cards.map(({ name, info }) => {
				return (
					<div
						className="p-4 bg-accent rounded overflow-hidden shadow-lg"
						key={name}
					>
						<div>{name}</div>
						<div className="bg-blue-500 text-white text-sm font-bold px-4 py-3">
							{info}
						</div>
					</div>
				);
			})}
		</div>
	);
}
