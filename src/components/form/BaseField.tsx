import type React from "react";

type BaseFieldProps = {
	label?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	type?: string;
	name?: string;
	disabled?: boolean;
	error?: string;
};

const BaseField: React.FC<BaseFieldProps> = ({
	label,
	value,
	onChange,
	placeholder,
	type = "text",
	name,
	disabled = false,
	error,
}) => (
	<div style={{ marginBottom: "1rem" }}>
		{label && (
			<label
				htmlFor={name}
				style={{ display: "block", marginBottom: "0.5rem" }}
			>
				{label}
			</label>
		)}
		<input
			id={name}
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			disabled={disabled}
			style={{
				padding: "0.5rem",
				border: error ? "1px solid red" : "1px solid #ccc",
				borderRadius: "4px",
				width: "100%",
			}}
		/>

		<div style={{ color: "red", marginTop: "0.25rem", fontSize: "10px" }}>
			{error ? error : <span style={{ visibility: "hidden" }}>.</span>}
		</div>
	</div>
);

export default BaseField;
