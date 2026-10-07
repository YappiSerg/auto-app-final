import { API, BAD_BRAND_WORDS } from '../config.js';
import { titleCase } from '../utils.js';

export class VehicleApi {
	async getBrands() {
		const data = await this.fetchJSON(`${API}/getallmakes?format=json`);
		return this.normalizeBrands(data.Results || []);
	}

	async getModels(makeId) {
		const data = await this.fetchJSON(`${API}/GetModelsForMakeId/${encodeURIComponent(makeId)}?format=json`);
		return [...new Map((data.Results || []).filter(model => model.Model_Name?.trim()).map(model => [model.Model_Name.trim(), model])).values()];
	}

	async fetchJSON(url) {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		return response.json();
	}

	normalizeBrands(results) {
		return results
			.map((i) => ({ makeId: String(i.MakeId || i.Make_ID || ""), makeName: titleCase(i.MakeName || i.Make_Name || "") }))
			.filter(
				(b) =>
					b.makeId &&
					b.makeName &&
					b.makeName.length < 30 &&
					!BAD_BRAND_WORDS.some((w) => b.makeName.toLowerCase().includes(w))
			)
			.sort((a, b) => a.makeName.localeCompare(b.makeName));
	}
}
