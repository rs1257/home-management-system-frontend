import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { z } from "zod";
import { createInventoryColumns } from "@/columns/inventoryColumns";
import Loader from "@/components/Loader";
import { Modal } from "@/components/Modal";
import { Table } from "@/components/Table";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useAppForm } from "@/util/form";
import { createLoader } from "@/util/loader";
import { useMutate } from "@/util/useMutate";

export type InventoryItem = {
	_id: string;
	name: string;
	quantity: number;
	threshold: number;
};

export const Route = createFileRoute("/inventory")({
	component: TableDemo,
	pendingComponent: Loader,
	loader: createLoader<InventoryItem[]>(
		["inventory"],
		"http://localhost:3005/api/inventory",
		"Failed to fetch inventory",
		useInventoryStore,
	),
});

function TableDemo() {
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const router = useRouter();

	const addInventoryItem = useMutate(
		["add-inventory-item"],
		isEdit ? "PUT" : "POST",
		"http://localhost:3005/api/inventory",
		"Failed to fetch add inventory item",
		async () => {
			await router.invalidate();
			setOpen(false);
			form.reset();
		},
	);

	const deleteInventoryItem = useMutate(
		["delete-inventory-item"],
		"DELETE",
		"http://localhost:3005/api/inventory",
		"Failed to delete inventory item",
		async () => {
			await router.invalidate();
		},
	);

	const form = useAppForm({
		defaultValues: {
			name: "",
			quantity: 0,
			threshold: 0,
			originalName: undefined,
		} as InventoryItem & { originalName?: string },
		onSubmit: ({ value: { name, quantity, threshold, originalName } }) => {
			addInventoryItem.mutate({
				name,
				quantity,
				threshold,
				originalName,
			});
		},
	});

	const columns = useMemo<ColumnDef<InventoryItem, string>[]>(
		() =>
			createInventoryColumns(
				(cell) => {
					form.setFieldValue("originalName", cell.row.original.name);
					form.setFieldValue("name", cell.row.original.name);
					form.setFieldValue("quantity", cell.row.original.quantity);
					form.setFieldValue("threshold", cell.row.original.threshold);
					setIsEdit(true);
					setOpen(true);
				},
				async (cell) => {
					deleteInventoryItem.mutate({ name: cell.row.original.name });
				},
			),
		[deleteInventoryItem.mutate, form.setFieldValue],
	);
	// 	() => [
	// 		{
	// 			accessorKey: "name",
	// 			header: "Name",
	// 		},
	// 		{
	// 			accessorKey: "quantity",
	// 			header: "Quantity",
	// 		},
	// 		{
	// 			accessorKey: "threshold",
	// 			header: "Threshold",
	// 		},
	// 		{
	// 			header: "Actions",
	// 			id: "actions",
	// 			cell: (cell) => (
	// 				<div className="grid content-around grid-cols-2 gap-3">
	// 					<button
	// 						type="button"
	// 						onClick={() => {
	// 							form.setFieldValue("originalName", cell.row.original.name);
	// 							form.setFieldValue("name", cell.row.original.name);
	// 							form.setFieldValue("quantity", cell.row.original.quantity);
	// 							form.setFieldValue("threshold", cell.row.original.threshold);
	// 							setIsEdit(true);
	// 							setOpen(true);
	// 						}}
	// 						className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors max-w-24"
	// 					>
	// 						Edit
	// 					</button>
	// 					<button
	// 						type="button"
	// 						onClick={async () => {
	// 							deleteInventoryItem.mutate({ name: cell.row.original.name });
	// 						}}
	// 						className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors max-w-24"
	// 					>
	// 						Delete
	// 					</button>
	// 				</div>
	// 			),
	// 		},
	// 	],
	// 	[deleteInventoryItem.mutate, form.setFieldValue],
	// );

	return (
		<div className="bg-background p-6">
			<button
				type="button"
				onClick={() => {
					setIsEdit(false);
					setOpen(true);
				}}
				className="px-4 py-2 m-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors float-right"
			>
				Add item
			</button>
			<Modal
				open={open}
				onClose={() => {
					setOpen(false);
					form.reset();
				}}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<h1>Add item</h1>
					<form.AppField
						name="name"
						validators={{
							onChange: z.string().min(3).max(20),
						}}
					>
						{(field) => (
							<field.BaseField
								label={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								error={
									!field.state.meta.isValid
										? field.state.meta.errors[0]?.message.replaceAll('"', "")
										: undefined
								}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="quantity"
						validators={{
							onChange: z.number().min(0).max(1000),
						}}
					>
						{(field) => (
							<field.BaseField
								type="number"
								label={field.name}
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.valueAsNumber)}
								error={
									!field.state.meta.isValid
										? field.state.meta.errors[0]?.message.replaceAll('"', "")
										: undefined
								}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="threshold"
						validators={{
							onChange: z.number().min(0).max(100),
						}}
					>
						{(field) => (
							<field.BaseField
								type="number"
								label={field.name}
								value={String(field.state.value)}
								onChange={(e) => field.handleChange(e.target.valueAsNumber)}
								error={
									!field.state.meta.isValid
										? field.state.meta.errors[0]?.message.replaceAll('"', "")
										: undefined
								}
							/>
						)}
					</form.AppField>

					<form.AppForm>
						<form.SubmitButton />
					</form.AppForm>
				</form>
			</Modal>
			<Table
				data={useInventoryStore((state) => state.inventory)}
				columns={columns}
			/>
		</div>
	);
}
