import { VehicleApi } from './services/VehicleApi.js';
import { BookingStorage } from './services/BookingStorage.js';
import { Feedback } from './views/Feedback.js';
import { Bookings } from './views/Bookings.js';
import { RentModal } from './views/RentModal.js';
import { Catalog } from './views/Catalog.js';

export class App {
	constructor() {
		const api = new VehicleApi();
		const storage = new BookingStorage();
		const feedback = new Feedback();
		this.bookings = new Bookings(storage, feedback);
		this.rentModal = new RentModal(storage, feedback, () => this.bookings.renderBookings());
		this.catalog = new Catalog(api, feedback, car => this.rentModal.openModal(car));
	}

	init() {
		document.querySelector('.nav').addEventListener('click', event => {
			const view = event.target.closest('[data-view]')?.dataset.view;
			if (view) this.switchView(view);
		});
		this.bookings.init();
		this.rentModal.init();
		return this.catalog.init();
	}

	switchView(view) {
		document.querySelectorAll(".view").forEach((s) => s.classList.toggle("active", s.id === `${view}-view`));
		document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
	}
}
