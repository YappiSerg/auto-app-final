import { carName, escapeHTML, formatDate, rub } from '../utils.js';

export class Bookings {
	constructor(storage, feedback) {
		this.storage = storage;
		this.feedback = feedback;
		this.bookingsCount = document.getElementById('bookings-count');
		this.bookingsList = document.getElementById('bookings-list');
	}

	init() {
		this.bookingsList.addEventListener('click', event => {
			const id = event.target.closest('[data-cancel]')?.dataset.cancel;
			if (id && confirm('Отменить это бронирование?')) {
				this.storage.saveBookings(this.storage.getBookings().filter(booking => booking.id !== id));
				this.renderBookings();
				this.feedback.showToast('Бронирование отменено');
			}
		});
		this.renderBookings();
	}

	renderBookings() {
		const list = this.storage.getBookings();
		this.bookingsCount.textContent = list.length;
		this.bookingsList.innerHTML = list.length
			? list.map(booking => this.bookingCard(booking)).join("")
			: `<p class="muted">У вас пока нет бронирований.</p>`;
	}

	bookingCard(b) {
		return `
			<article class="booking-card">
				<div>
					<h4>${escapeHTML(carName(b))}</h4>
					<p>Клиент: ${escapeHTML(b.customer)}</p>
					<p>Телефон: ${escapeHTML(b.phone)}</p>
					<p>Период: ${formatDate(b.from)} — ${formatDate(b.to)} (${b.days} дн.)</p>
					<p>Итого: <strong>${rub.format(b.total)}</strong></p>
				</div>
				<button class="btn danger" data-cancel="${escapeHTML(b.id)}">Отменить</button>
			</article>
		`;
	}
}
