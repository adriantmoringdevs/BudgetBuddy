const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(value) {
  return currency.format(Number(value) || 0);
}
