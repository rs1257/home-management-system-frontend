import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { ColumnDef } from "@tanstack/react-table";

import { Modal } from "@/components/Modal";
import BaseField from "@/components/form/BaseField";
import { SubmitButton } from "@/components/form/SubmitButton";
import Loader from "@/icons/loader";
import { fuzzyFilter } from "@/util/table";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

type InventoryItem = {
	_id: string;
	name: string;
	quantity: number;
	threshold: number;
	// Add other fields if needed, e.g. description?: string;
};

const loader = async () => {
	const { data, status } = await axios.get<InventoryItem[]>(
		"http://localhost:3005/api/inventory",
	);
	if (status !== 200) throw new Error("Failed to fetch inventory");

	return data;
};

export const Route = createFileRoute("/inventory/table")({
	component: TableDemo,
	pendingComponent: () => (
		<div className="flex flex-col h-screen w-screen items-center">
			<Loader title="loader" className="animate-spin" />
			<div>Loading</div>
		</div>
	),
	loader,
});

const { fieldContext, formContext } = createFormHookContexts();
const { useAppForm } = createFormHook({
	fieldComponents: {
		BaseField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});

function TableDemo() {
	const [open, setOpen] = useState(false);
	const [globalFilter, setGlobalFilter] = React.useState("");

	const addInventoryItem = useMutation({
		mutationKey: ["add-inventory-item"],
		mutationFn: async (inventoryData: {
			name: string;
			quantity: number;
			threshold: number;
		}) => {
			const { data, status } = await axios.post<[]>(
				"http://localhost:3005/api/inventory",
				inventoryData,
			);
			if (![200, 201].includes(status))
				throw new Error("Failed to fetch add inventory item");

			return data;
		},
		onSuccess: async () => {
			await router.invalidate();
			setOpen(false);
			form.reset();
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
			quantity: 0,
			threshold: 0,
		},
		onSubmit: ({ value: { name, quantity, threshold } }) => {
			addInventoryItem.mutate({
				name,
				quantity,
				threshold,
			});
		},
	});

	const deleteInventoryItem = useMutation({
		mutationKey: ["delete-inventory-item"],
		mutationFn: async ({
			name,
		}: {
			name: string;
		}) => {
			const { data, status } = await axios.delete<[]>(
				"http://localhost:3005/api/inventory",
				{
					data: {
						name,
					},
				},
			);
			if (![200, 201].includes(status))
				throw new Error("Failed to fetch inventory");

			return data;
		},
		onSuccess: async () => {
			await router.invalidate();
		},
	});

	const columns = React.useMemo<ColumnDef<InventoryItem, string>[]>(
		() => [
			{
				accessorKey: "_id",
				header: "Id",
			},
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
							onClick={() => {
								// TODO need to change the command to a PUT command otherwise if the name changes it wont remove the old.
								form.setFieldValue("name", cell.row.original.name);
								form.setFieldValue("quantity", cell.row.original.quantity);
								form.setFieldValue("threshold", cell.row.original.threshold);
								setOpen(true);
							}}
							className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors max-w-24"
						>
							Edit
						</button>
						<button
							type="button"
							onClick={async () => {
								deleteInventoryItem.mutate({ name: cell.row.original.name });
							}}
							className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors max-w-24"
						>
							Delete
						</button>
					</div>
				),
			},
		],
		[deleteInventoryItem.mutate, form.setFieldValue],
	);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 25,
	});

	const data = Route.useLoaderData();
	const router = useRouter();

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			globalFilter,
			pagination,
		},
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "fuzzy",
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		debugTable: true,
		debugHeaders: true,
		debugColumns: false,
	});

	return (
		<div className="min-h-screen bg-gray-900 p-6">
			<button
				type="button"
				onClick={() => setOpen(true)}
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
			<div>
				<DebouncedInput
					value={globalFilter ?? ""}
					onChange={(value) => setGlobalFilter(String(value))}
					className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					placeholder="Search all columns..."
				/>
			</div>
			<div className="h-4" />
			<div className="overflow-x-auto rounded-lg border border-gray-700">
				<table className="w-full text-sm text-gray-200">
					<thead className="bg-gray-800 text-gray-100">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											className="px-4 py-3 text-left"
										>
											{header.isPlaceholder ? null : (
												<>
													<div
														{...{
															className: header.column.getCanSort()
																? "cursor-pointer select-none hover:text-blue-400 transition-colors"
																: "",
															onClick: header.column.getToggleSortingHandler(),
														}}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
														{{
															asc: " 🔼",
															desc: " 🔽",
														}[header.column.getIsSorted() as string] ?? null}
													</div>
												</>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-gray-700">
						{table.getRowModel().rows.map((row) => {
							console.log(row.original.threshold);
							const isLessThanThreshold =
								row.original.quantity < row.original.threshold;
							const isEqualToThreshold =
								row.original.quantity === row.original.threshold;
							const violationClass = isLessThanThreshold
								? "bg-red-700 hover:bg-red-800 transition-colors"
								: "bg-orange-400 hover:bg-orange-500 transition-colors text-gray-800";
							return (
								<tr
									key={row.id}
									className={
										!(isEqualToThreshold || isLessThanThreshold)
											? "hover:bg-gray-800 transition-colors"
											: violationClass
									}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<td key={cell.id} className="px-4 py-3">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="h-4" />
			<div className="flex flex-wrap items-center gap-2 text-gray-200">
				<button
					type="button"
					className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{"<"}
				</button>
				<button
					type="button"
					className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{">"}
				</button>
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</strong>
				</span>
				<select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value));
					}}
					className="px-2 py-1 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
				>
					{[25, 50, 75, 100].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
				of {table.getPrePaginationRowModel().rows.length} rows
			</div>
		</div>
	);
}

// A typical debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value, debounce, onChange]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
