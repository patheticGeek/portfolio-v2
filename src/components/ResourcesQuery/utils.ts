const randomBetween = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min)

export const getRandoms = (length: number) => [
  ...new Set(new Array(5).fill(null).map(() => randomBetween(0, length - 1)))
]
