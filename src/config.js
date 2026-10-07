const API = "https://vpic.nhtsa.dot.gov/api/vehicles";
const STORAGE_KEY = "car_rent_bookings_v1";

const POPULAR = ["Toyota", "Kia", "Hyundai", "Volkswagen", "BMW", "Mercedes-Benz", "Lada", "Mazda", "Nissan", "Ford", "Chevrolet", "Honda", "Lexus", "Audi"];
const BAD_BRAND_WORDS = ["other", "unknown", "customs"];

export const POPULAR_KEYS = POPULAR.map(name => name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
export { API, STORAGE_KEY, BAD_BRAND_WORDS };
