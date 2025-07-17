import type { ReactNode } from "react";

export const Modal: React.FC<{
	open: boolean;
	onClose: () => void;
	children: ReactNode;
}> = ({ open, onClose, children }) => {
	if (!open) return null;
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: "rgba(0,0,0,0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
			}}
			onClick={onClose}
			onKeyDown={(e) => {
				// Prevent propagation for keyboard events as well
				e.stopPropagation();
			}}
			tabIndex={-1}
		>
			<div
				style={{
					background: "#fff",
					padding: 24,
					borderRadius: 8,
					minWidth: 400,
					position: "relative",
				}}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => {
					// Prevent propagation for keyboard events as well
					e.stopPropagation();
				}}
				tabIndex={-1}
			>
				{children}
				<button
					type="button"
					style={{
						position: "absolute",
						top: 8,
						right: 8,
						background: "transparent",
						border: "none",
						fontSize: 18,
						cursor: "pointer",
					}}
					onClick={onClose}
					aria-label="Close"
				>
					×
				</button>
			</div>
		</div>
	);
};
