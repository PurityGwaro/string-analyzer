export const checkWordCount = (value) => {
    const trimmed = value.trim()
    if (trimmed === '') return 0
    const words = trimmed.split(/\s+/)
    return words.length
}