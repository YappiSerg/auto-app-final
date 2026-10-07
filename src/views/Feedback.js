export class Feedback {
	constructor() {
		this.statusEl = document.getElementById('status');
		this.toast = document.getElementById('toast');
		this.toastTimer = null;
	}

	setStatus(text, type = "") {
		this.statusEl.textContent = text;
		this.statusEl.className = `status ${type}`.trim();
	}

	showToast(message) {
		this.toast.textContent = message;
		this.toast.classList.remove("hidden");
		clearTimeout(this.toastTimer);
		this.toastTimer = setTimeout(() => this.toast.classList.add("hidden"), 2500);
	}
}
