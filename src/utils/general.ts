export function shortModelName(name: string, minify: boolean = false, max: number = 35) {
  /* AI-ASSISTED (ChatGPT):
   * Asked how to remove url and normalize
   * the model names from HF with regex + split
   */
  const check = name.replace(/^hf\.co\//, '')
  const normalized = check.split('/')[1] ?? check

  if (normalized.length <= max || !minify) {
    return normalized
  }

  const prefix = normalized.slice(0, 12)
  const suffix = normalized.slice(-12)

  return `${prefix}...${suffix}`
}
