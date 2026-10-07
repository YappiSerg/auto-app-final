import { STORAGE_KEY } from '../config.js';

export class BookingStorage {
	constructor(storage = localStorage) {
		this.storage = storage;
	}

	getBookings() {
		try {
			const list = JSON.parse(this.storage.getItem(STORAGE_KEY));
			return Array.isArray(list) ? list : [];
		} catch {
			return [];
		}
	}

	saveBookings(list) {
		this.storage.setItem(STORAGE_KEY, JSON.stringify(list));
	}
}
