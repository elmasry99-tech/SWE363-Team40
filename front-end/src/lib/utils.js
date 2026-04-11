export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatCount(value) {
  return new Intl.NumberFormat("en").format(value);
}

export function titleCase(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
