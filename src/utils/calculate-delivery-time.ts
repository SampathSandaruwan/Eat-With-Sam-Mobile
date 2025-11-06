export const calculateDeliveryTime = (averageDeliveryTime: number) => {
  const minTime = Math.floor(averageDeliveryTime / 10 - 0.5) * 10;
  const maxTime = minTime + 15;

  return { minTime, maxTime };
};
