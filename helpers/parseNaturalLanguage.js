export const parseNaturalLanguageQuery = (query) => {
    const lowerQuery = query.toLowerCase()
    const filters = {}

    if (lowerQuery.includes('palindrome') || lowerQuery.includes('palindromic')) {
        filters.is_palindrome = true
    }
    if (lowerQuery.includes('single word')) {
        filters.word_count = 1
    } else if (lowerQuery.includes('two word')) {
        filters.word_count = 2
    } else if (lowerQuery.includes('three word')) {
        filters.word_count = 3
    }
    const longerThanMatch = lowerQuery.match(/longer than (\d+)/)
    if (longerThanMatch) {
        filters.min_length = parseInt(longerThanMatch[1]) + 1
    }

    const shorterThanMatch = lowerQuery.match(/shorter than (\d+)/)
    if (shorterThanMatch) {
        filters.max_length = parseInt(shorterThanMatch[1]) - 1
    }

    const atLeastMatch = lowerQuery.match(/at least (\d+) characters?/)
    if (atLeastMatch) {
        filters.min_length = parseInt(atLeastMatch[1])
    }

    const atMostMatch = lowerQuery.match(/at most (\d+) characters?/)
    if (atMostMatch) {
        filters.max_length = parseInt(atMostMatch[1])
    }
    const containsLetterMatch = lowerQuery.match(/contain(?:s|ing)? (?:the )?letter ([a-z])/)
    if (containsLetterMatch) {
        filters.contains_character = containsLetterMatch[1]
    }
    if (lowerQuery.includes('first vowel')) {
        filters.contains_character = 'a'
    }
    const containsCharMatch = lowerQuery.match(/contain(?:s|ing)? ([a-z])(?:\s|$)/)
    if (containsCharMatch && !filters.contains_character) {
        filters.contains_character = containsCharMatch[1]
    }

    if (filters.min_length !== undefined && filters.max_length !== undefined) {
        if (filters.min_length > filters.max_length) {
            const error = new Error('Query parsed but resulted in conflicting filters')
            error.code = 422
            throw error
        }
    }

    if (Object.keys(filters).length === 0) {
        const error = new Error('Unable to parse natural language query')
        error.code = 400
        throw error
    }

    return filters
}