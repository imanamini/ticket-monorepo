export function CalculateRemainingInventoryPercent(remainingInventory: number, initialBalance: number): number {
  return (remainingInventory / initialBalance) * 100;
}
