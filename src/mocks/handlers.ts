import { http, HttpResponse } from "msw";

const handlers = [
	http.get("http://msw-test.com/api/data", () => {
		return HttpResponse.json({
			message: "This is a mock response from the server.",
			data: [
				{ name: "Ryan" },
				{ name: "Jess" },
				{ name: "Timi" },
				{ name: "Ali" },
				{ name: "Alexis" },
			],
		});
	}),
];

export default handlers;
