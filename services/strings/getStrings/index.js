import { StringModel } from "../../../models/schema/string.js"
import { transformString } from "../../../helpers/transformString.js"

const getStrings = async (filters) => {
    try {
        const query = {}
        // Filter by is_palindrome (nested in properties)
        if (filters.is_palindrome !== undefined) {
            query['properties.is_palindrome'] = filters.is_palindrome
        }
        // Filter by min_length (range query)
        if (filters.min_length !== undefined) {
            query['properties.length'] = query['properties.length'] || {}
            query['properties.length'].$gte = filters.min_length
        }
        // Filter by max_length (range query)
        if (filters.max_length !== undefined) {
            query['properties.length'] = query['properties.length'] || {}
            query['properties.length'].$lte = filters.max_length
        }
        // Filter by exact word_count
        if (filters.word_count !== undefined) {
            query['properties.word_count'] = filters.word_count
        }
        // Filter by contains_character (check if character exists in frequency map)
        if (filters.contains_character !== undefined) {
            query[`properties.character_frequency_map.${filters.contains_character}`] = { $exists: true }
        }
        return await StringModel.find(query)
    } catch (error) {
        throw error
    }
}

const getStringById = async (id) => {
    try {
        const string = await StringModel.findById(id)
        if (!string) {
            const error = new Error("String does not exist in the system")
            error.code = 404
            throw error
        }
        return transformString(string)
    } catch (error) {
        throw error
    }
}

const getStringByValue = async (value) => {
    try {
        const string = await StringModel.findOne({ value })
        if (!string) {
            const error = new Error("String does not exist in the system")
            error.code = 404
            throw error
        }
        return transformString(string)
    } catch (error) {
        throw error
    }
}

export { getStrings, getStringById, getStringByValue }