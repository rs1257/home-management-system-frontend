import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";

const Loader: React.FC = () => {
	return (
		<div className="flex flex-col h-screen w-screen items-center">
			<FontAwesomeIcon
				icon={faGear}
				className="fa-6x fa-spin text-gray-600 mb-4"
			/>
			<div>Constructing pages</div>
		</div>
	);
};

export default Loader;
