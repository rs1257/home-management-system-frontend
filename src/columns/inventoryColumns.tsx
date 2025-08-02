import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type { InventoryItem } from "@/routes/inventory";

export const createInventoryColumns = (
	onEdit: (cell: CellContext<InventoryItem, string>) => Promise<void> | void,
	onDelete: (cell: CellContext<InventoryItem, string>) => Promise<void> | void,
): ColumnDef<InventoryItem, string>[] => {
	return [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
		},
		{
			accessorKey: "threshold",
			header: "Threshold",
		},
		{
			header: "Actions",
			id: "actions",
			cell: (cell) => (
				<div className="grid content-around grid-cols-2 gap-3">
					<button
						type="button"
						onClick={async () => await onEdit(cell)}
						className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors max-w-24"
					>
						Edit
					</button>
					<button
						type="button"
						onClick={async () => await onDelete(cell)}
						className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors max-w-24"
					>
						Delete
					</button>
				</div>
			),
		},
	];
};
