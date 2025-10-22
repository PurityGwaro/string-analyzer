export const checkWordCount = (value) => {
    const words = value.trim().split(/\s+/)
    return words.length
}