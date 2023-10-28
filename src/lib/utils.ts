export function distinctColors(n: number): string[] {
  const res: string[] = [];
  // const gap = Math.floor(360 / n);

  // https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans
  // golden angle
  const gap = 137.5;

  for (let i = 0; i < n; ++i) res.push(`hsl(${(i * gap) % 360}, 80%, 35%)`);

  return res;
}

export function removeDuplicatesAndSort(arr: number[]) {
  return [...new Set(arr)].sort((a, b) => a - b);
}

export function binarySearch(
  left: number,
  right: number,
  target: number,
  f: (x: number) => number
): [number, boolean] {
  const epsilon = 0.0001;
  const eq = (a: number, b: number) => Math.abs(a - b) < epsilon;

  let mid: number, diff: number;

  if (f(left) > f(right)) {
    return binarySearch(right, left, target, f);
  } else if (
    f(right) < target ||
    target < f(left) ||
    eq(f(left), target) ||
    eq(f(right), target)
  ) {
    return [-1, false];
  }

  do {
    mid = (left + right) / 2;
    diff = f(mid) - target;

    if (diff < 0) {
      left = mid;
    } else {
      right = mid;
    }
  } while (Math.abs(diff) > epsilon);

  return [Math.round(mid * 100) / 100, true];
}
