export interface GapPercentageListItem {
  text: string;
  value: string | number;
}

export interface PositionItem {
  price: number;
  openPrice: number;
  stopLimitPrice: number;
  stopPercentage: number;
  stopSize: number;
  gapPercentage: number;
  gap: number;
  fee: number;
  riskProfit: Record<number, number>;
  risk: number;
  isLongPosition: boolean;
  isManualStop: boolean;
}
