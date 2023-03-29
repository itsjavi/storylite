export function arrayShuffle<T>(a: T[]): typeof a {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    // swap positions
    ;[a[i], a[j]] = [a[j], a[i]]
  }

  return a
}
