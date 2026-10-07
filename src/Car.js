import { titleCase } from './utils.js';

export class Car {
	constructor(brand, model, index) {
		const modelName = titleCase(model.Model_Name.trim());
		const id = `${brand.makeId}-${model.Model_Id ?? index}-${index}`;
		const label = encodeURIComponent(`${brand.makeName} ${modelName}`);

		Object.assign(this, {
			id,
			makeName: brand.makeName,
			modelName,
			price: 1500,
			stock: 3,
			rating: 0,
			image: `https://placehold.co/400x300/e2e8f0/64748b?text=${label}&font=raleway`,
		});
	}
}
