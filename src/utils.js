import { POPULAR_KEYS } from './config.js';

export const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
export const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export const isPopular = (name) => POPULAR_KEYS.some((p) => norm(name) === p || norm(name).startsWith(p + " "));
export const titleCase = (s) => String(s).toLowerCase().replace(/(^|[\s-])\w/g, (m) => m.toUpperCase());
export const carName = (o) => `${o.makeName} ${o.modelName}`;
export const escapeHTML = (s) =>
	String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);
export const todayISO = () => isoDate(Date.now() - new Date().getTimezoneOffset() * 6e4);
export const addDaysISO = (s, n) => isoDate(Date.parse(s) + n * 864e5);
export const formatDate = (s) => new Date(s).toLocaleDateString("ru-RU", { timeZone: "UTC" });
export function diffDays(from, to) {
	const d = (Date.parse(to) - Date.parse(from)) / 864e5;
	return Number.isFinite(d) ? Math.max(0, Math.round(d)) : 0;
}

export const debounce = (fn, ms) => {
	let t;
	return () => {
		clearTimeout(t);
		t = setTimeout(fn, ms);
	};
};
