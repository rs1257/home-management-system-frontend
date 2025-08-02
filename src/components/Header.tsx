import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

const headers = [
	{ link: "/", displayName: "Home" },
	{ link: "/inventory", displayName: "Inventory" },
	{ link: "/taskLists", displayName: "Task Lists" },
	{ link: "/wishList", displayName: "Wish List" },
	{ link: "/moneyTracker", displayName: "Money Tracker" },
	{ link: "/expenses", displayName: "Expenses" },
];

export default function Header() {
	const [isDarkMode, setIsDarkMode] = useState(
		document.getElementById("app")?.classList.contains("dark"),
	);

	return (
		<header className="p-3 flex gap-2 bg-secondary text-text justify-between sticky top-0 z-50">
			<nav className="flex flex-row justify-between w-full">
				{headers.map(({ link, displayName }) => {
					return (
						<motion.div
							whileHover={{ scale: 1.2 }}
							key={displayName}
							className="px-3 font-bold hover:underline hover:text-accent"
						>
							<Link to={link}>{displayName}</Link>
						</motion.div>
					);
				})}
				<div className="w-[30px] flex justify-center items-center">
					<motion.div whileHover={{ scale: 1.2 }} className="hover:text-accent">
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
					</motion.div>
				</div>
			</nav>
		</header>
	);
}
