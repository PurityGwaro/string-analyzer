export const checkUniqueCharacters = (value) => {
    const valueWithoutSpaces = value.replace(/\s/g, '')
    const uniqueCharacters = new Set(valueWithoutSpaces)
    return uniqueCharacters.size
}