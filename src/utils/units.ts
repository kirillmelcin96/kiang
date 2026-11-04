const k = 1024 // kilo

/**
 * Converts kilobytes to gigabytes
 */
export function bytesToGb(b: number, fixed: number = 1) {
  if (b === 0) return '0'

  return (b / (k * k * k)).toFixed(fixed) + ' GB'
}

/**
 * Converts context length to kilo
 */
export function contextLengthToK(cl: number | undefined) {
  if (!cl) return 'unknown'

  return (cl / k).toFixed() + 'K'
}

/**
 * Useful function for formating big numbers such as `likes` or `downloads count`
 * @param count
 * @returns
 */
export function formatBigNumbers(count: number) {
  if (count >= 1000000) {
    // Millions
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (count >= 1000) {
    // Thousands
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  // Less than 1000
  return count.toString()
}
