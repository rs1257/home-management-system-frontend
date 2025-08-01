import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wishList")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<ul>
			<li>Name, Price, Quantity, Link</li>
		</ul>
	);
}
