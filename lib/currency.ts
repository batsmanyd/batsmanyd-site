export const BYN_TO_USD = 3.27;

export type Currency = "BYN" | "USD";

/** Белорусский рубль */
export function formatBYN(amount: number): string {
  return (
    amount.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " BYN"
  );
}

/** Доллары США */
export function formatUSD(amount: number): string {
  return (
    "$" + amount.toLocaleString("en-US", { maximumFractionDigits: 0 })
  );
}

export function formatBYNShort(amount: number): string {
  if (amount >= 1000) {
    return (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1) + "K BYN";
  }
  return formatBYN(amount);
}

export function formatMoney(amountBYN: number, currency: Currency): string {
  if (currency === "BYN") return formatBYN(amountBYN);
  return formatUSD(Math.round(amountBYN / BYN_TO_USD));
}