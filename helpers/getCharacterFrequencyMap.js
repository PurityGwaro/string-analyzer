export const getCharacterFrequencyMap = (value) => {
    const valueWithoutSpaces = value.replace(/\s/g, '')
    const map = {}
    for (const char of valueWithoutSpaces) {
        map[char] = (map[char] || 0) + 1
    }
    return map
}