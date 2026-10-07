import { POPULAR_KEYS } from '../config.js';
import { carName, debounce, escapeHTML, isPopular, norm, rub } from '../utils.js';
import { Car } from '../Car.js';

export class Catalog {
	constructor(api, feedback, onRent) {
		this.api = api;
		this.feedback = feedback;
		this.onRent = onRent;
		this.brands = [];
		this.cars = [];
		this.loadedMakeId = '';
		this.requestId = 0;
		this.brandSelect = document.getElementById('brand-select');
		this.brandSearch = document.getElementById('brand-search-input');
		this.brandPopular = document.getElementById('brand-popular-select');
		this.modelSearch = document.getElementById('search-input');
		this.sortSelect = document.getElementById('sort-select');
		this.carsGrid = document.getElementById('cars-grid');
		this.sorters = {
			'price-asc': (a, b) => a.price - b.price,
			'price-desc': (a, b) => b.price - a.price,
			name: (a, b) => a.modelName.localeCompare(b.modelName, 'ru'),
		};
	}

	init() {
		this.brandSelect.addEventListener('change', () => this.loadModels(this.brandSelect.value));
		this.brandSearch.addEventListener('input', debounce(() => this.renderBrandOptions(), 300));
		this.brandPopular.addEventListener('change', () => this.renderBrandOptions());
		this.modelSearch.addEventListener('input', () => this.renderCars());
		this.sortSelect.addEventListener('change', () => this.renderCars());
		this.carsGrid.addEventListener('click', event => {
			const id = event.target.closest('[data-rent]')?.dataset.rent;
			const car = this.cars.find(item => item.id === id);
			if (car) this.onRent(car);
		});
		return this.loadBrands();
	}

	async loadBrands() {
		this.feedback.setStatus("Загружаем список марок из API...");

		try {
			this.brands = await this.api.getBrands();
			if (!this.brands.length) throw new Error("API не вернул список марок");

			const preferred = this.brands.find((b) => POPULAR_KEYS.slice(0, 7).includes(norm(b.makeName)));
			this.renderBrandOptions(preferred?.makeId);
		} catch (error) {
			this.feedback.setStatus(`Ошибка загрузки марок: ${error.message}`, "error");
		}
	}

	renderBrandOptions(preferredId) {
		const query = this.brandSearch.value.trim().toLowerCase();
		const onlyPopular = this.brandPopular.value === "popular";
		const visible = this.brands.filter(
			(b) => b.makeName.toLowerCase().includes(query) && (!onlyPopular || isPopular(b.makeName))
		);

		if (!visible.length) {
			this.brandSelect.innerHTML = `<option value="">Нет марок</option>`;
			this.cars = [];
			this.loadedMakeId = "";
			this.requestId++;
			this.renderCars();
			this.feedback.setStatus("По фильтру не найдено ни одной марки", "error");
			return;
		}

		const previous = String(preferredId ?? this.brandSelect.value);
		const brand = visible.find((b) => b.makeId === previous) || visible[0];

		this.brandSelect.innerHTML = visible.map((b) => `<option value="${b.makeId}">${escapeHTML(b.makeName)}</option>`).join("");
		this.brandSelect.value = brand.makeId;

		if (brand.makeId !== this.loadedMakeId) this.loadModels(brand.makeId);
	}

	async loadModels(makeId) {
		const brand = this.brands.find((b) => b.makeId === String(makeId));
		if (!brand) return;

		const id = ++this.requestId;
		this.feedback.setStatus(`Загружаем модели для марки ${brand.makeName}...`);

		try {
			const models = await this.api.getModels(makeId);
			if (id !== this.requestId) return;

			this.cars = models.slice(0, 24).map((model, index) => new Car(brand, model, index));
			this.loadedMakeId = brand.makeId;
			this.renderCars();
			this.feedback.setStatus("");
		} catch (error) {
			if (id !== this.requestId) return;
			this.cars = [];
			this.renderCars();
			this.feedback.setStatus(`Ошибка загрузки моделей: ${error.message}`, "error");
		}
	}

	renderCars() {
		const query = this.modelSearch.value.trim().toLowerCase();
		const list = this.cars.filter((car) => carName(car).toLowerCase().includes(query));
		const sorter = this.sorters[this.sortSelect.value];
		if (sorter) list.sort(sorter);

		this.carsGrid.innerHTML = list.length
			? list.map(car => this.carCard(car)).join("")
			: `<p class="muted">По вашему запросу ничего не найдено.</p>`;
	}

	carCard(car) {
		const title = escapeHTML(carName(car));

		return `
			<article class="card">
				<img src="${car.image}" alt="${title}" class="card-image" loading="lazy" />
				<div class="card-body">
					<div class="card-top">
						<h3>${title}</h3>
						<span class="rating">★ ${car.rating}</span>
					</div>
					<p class="muted">В наличии: ${car.stock} шт.</p>
					<div class="price">${rub.format(car.price)} <span>/ сутки</span></div>
					<button class="btn primary" data-rent="${car.id}">Арендовать</button>
				</div>
			</article>
		`;
	}
}
