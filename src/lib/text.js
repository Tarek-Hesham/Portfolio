// Letters grouped by word (with a running letter index for staggers), so a long
// title wraps between words and never inside one.
export function wordChars(text) {
  let n = 0
  return text.split(' ').map((word) => [...word].map((c) => ({ c, i: n++ })))
}
