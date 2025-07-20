import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export default function Header() {
	const [isDarkMode, setIsDarkMode] = useState(
		document.getElementById("app")?.classList.contains("dark"),
	);

	return (
		<header className="p-2 flex gap-2 bg-white text-black justify-between">
			<nav className="flex flex-row">
				<div className="px-2 font-bold hover:underline hover:text-accent">
					<Link to="/">Home</Link>
				</div>

				<div className="px-2 font-bold hover:underline hover:text-accent">
					<Link to="/taskLists">Task Lists</Link>
				</div>
			</nav>
			<div>
				{!isDarkMode && (
					<FontAwesomeIcon
						icon={faMoon}
						onClick={() => {
							document.getElementById("app")?.classList.add("dark");
							document.getElementById("app")?.classList.remove("light");
							setIsDarkMode(true);
						}}
					/>
				)}
				{isDarkMode && (
					<FontAwesomeIcon
						icon={faSun}
						onClick={() => {
							document.getElementById("app")?.classList.add("light");
							document.getElementById("app")?.classList.remove("dark");
							setIsDarkMode(false);
						}}
					/>
				)}
			</div>
		</header>
	);
}
