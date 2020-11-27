export default function calculatePriceByRating(rating: number): number {
  if (rating >= 1 && rating <= 3) {
    return 3500;
  }
  if (rating > 3 && rating <= 6) {
    return 8250;
  }
  if (rating > 6 && rating <= 8) {
    return 16350;
  }
  if (rating > 8 && rating <= 10) {
    return 21250;
  }
  return 0;
}
