import { addDaysISO, carName, diffDays, rub, todayISO } from '../utils.js';

export class RentModal {
	constructor(storage, feedback, onSave) {
		this.storage = storage;
		this.feedback = feedback;
		this.onSave = onSave;
		this.selected = null;
		this.modal = document.getElementById('rent-modal');
		this.form = document.getElementById('rent-form');
		this.fields = this.form.elements;
	}

	init() {
		document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
		this.modal.addEventListener('click', event => {
			if (event.target === this.modal) this.closeModal();
		});
		document.addEventListener('keydown', event => {
			if (event.key === 'Escape') this.closeModal();
		});
		this.form.addEventListener('submit', event => this.handleRentSubmit(event));
		this.fields.from.addEventListener('change', () => this.updateSummary());
		this.fields.to.addEventListener('change', () => this.updateSummary());
	}

	saveBookingList(list) {
		this.storage.saveBookings(list);
		this.onSave();
	}

	openModal(car) {
		this.selected = car;

		document.getElementById("modal-car-title").textContent = carName(car);
		document.getElementById("modal-car-info").textContent = `${rub.format(car.price)} в сутки | в наличии ${car.stock} шт.`;
		document.getElementById("modal-price").textContent = rub.format(car.price);

		const today = todayISO();
		this.fields.from.min = today;
		this.fields.from.value = today;
		this.fields.to.value = addDaysISO(today, 1);
		this.updateSummary();

		this.modal.classList.remove("hidden");
		this.fields.customer.focus();
	}

	closeModal() {
		this.modal.classList.add("hidden");
		this.selected = null;
	}

	updateSummary() {
		if (!this.selected) return;

		this.fields.to.min = this.fields.from.value;
		const days = diffDays(this.fields.from.value, this.fields.to.value);

		document.getElementById("modal-days").textContent = days;
		document.getElementById("modal-total").textContent = rub.format(days * this.selected.price);
	}

	handleRentSubmit(event) {
		event.preventDefault();
		if (!this.selected) return;

		const data = Object.fromEntries(new FormData(this.form));
		const customer = data.customer.trim();
		const phone = data.phone.trim();
		const days = diffDays(data.from, data.to);

		if (customer.length < 2) return this.feedback.showToast("Введите имя");
		if (phone.replace(/\D/g, "").length < 6) return this.feedback.showToast("Введите телефон");
		if (days < 1) return this.feedback.showToast("Дата возврата должна быть позже даты начала аренды");

		this.saveBookingList([
			{
				id: String(Date.now()),
				carId: this.selected.id,
				makeName: this.selected.makeName,
				modelName: this.selected.modelName,
				pricePerDay: this.selected.price,
				days,
				total: days * this.selected.price,
				customer,
				phone,
				from: data.from,
				to: data.to,
				comment: data.comment.trim(),
				createdAt: new Date().toISOString(),
			},
			...this.storage.getBookings(),
		]);

		this.closeModal();
		this.form.reset();
		this.feedback.showToast("Бронирование создано");
	}
}
