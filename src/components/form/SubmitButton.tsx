export const SubmitButton: React.FC<
	React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
	<button
		type="submit"
		{...props}
		className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
	>
		Add
	</button>
);
