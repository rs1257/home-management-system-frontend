import { faker } from "@faker-js/faker";

export type InventoryItem = {
	id: number;
	name: string;
	description: string;
	quantity: number;
	threshold: number;
};

const range = (len: number) => {
	const arr: number[] = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

const newInventoryItem = (num: number): InventoryItem => {
	return {
		id: num,
		name: faker.lorem.words(2),
		description: faker.lorem.paragraph(),
		quantity: faker.number.int(40),
		threshold: faker.number.int(1000),
	};
};

export function makeData(...lens: number[]) {
	const makeDataLevel = (depth = 0): InventoryItem[] => {
		const len = lens[depth] ?? 0;
		return range(len).map((index): InventoryItem => {
			return {
				...newInventoryItem(index),
				// subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
			};
		});
	};

	return makeDataLevel();
}
