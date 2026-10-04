const k = 1024 // kilo

/**
 * Converts kilobytes to gigabytes
 */
export function bytesToGb(b: number, fixed: number = 1) {
  if (b === 0) return '0'

  return (b / (k * k * k)).toFixed(fixed) + 'GB'
}

/**
 * Converts context length to kilo
 */
export function contextLengthToK(cl: number | undefined) {
  if (!cl) return 'unknown'

  return (cl / k).toFixed() + 'K'
}
