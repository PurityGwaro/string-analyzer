import express from 'express'
import createString from '../services/strings/createString/index.js'
import { getStrings, getStringById, getStringByValue } from '../services/strings/getStrings/index.js'
import validateCreateStringRequestSchema from '../helpers/createStringRequestSchema.js'
import { transformString } from '../helpers/transformString.js'
import validateGetStringsQuery from '../helpers/getStringsQuerySchema.js'
import { deleteStringByValue } from '../services/strings/deleteString/index.js'
import { parseNaturalLanguageQuery } from '../helpers/parseNaturalLanguage.js'

const router = express.Router()

router.post("/", validateCreateStringRequestSchema, async (req, res) => {
    const { value } = req.body
    try {
        const string = await createString(value)
        res.status(201).json({
            id: string.id,
            value: string.value,
            properties: string.properties,
            created_at: string.created_at
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "String already exists in the system" })
        }
        res.status(500).json({ message: error.message })
    }
})

router.get("/filter-by-natural-language", async (req, res) => {
    const { query } = req.query
    
    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" })
    }

    try {
        const filters = parseNaturalLanguageQuery(query)
        const strings = await getStrings(filters)
        
        res.status(200).json({
            data: strings.map(string => transformString(string)),
            count: strings.length,
            interpreted_query: {
                original: query,
                parsed_filters: filters
            }
        })
    } catch (error) {
        if (error.code === 400) {
            return res.status(400).json({ message: "Unable to parse natural language query" })
        }
        if (error.code === 422) {
            return res.status(422).json({ message: "Query parsed but resulted in conflicting filters" })
        }
        res.status(500).json({ message: error.message })
    }
})

router.get("/:string_value", async (req, res) => {
    const { string_value } = req.params
    try {
        const decodedValue = decodeURIComponent(string_value)
        const string = await getStringByValue(decodedValue)
        res.status(200).json(string)
    } catch (error) {
        if (error.code === 404) {
            return res.status(404).json({ message: "String does not exist in the system" })
        }
        res.status(500).json({ message: error.message })
    }
})

router.get("/", validateGetStringsQuery, async (req, res) => {
    try {
        const filters = {}
        const filtersApplied = {}

        if (req.query.is_palindrome !== undefined) {
            filters.is_palindrome = req.query.is_palindrome === 'true' || req.query.is_palindrome === true
            filtersApplied.is_palindrome = filters.is_palindrome
        }
        if (req.query.min_length !== undefined) {
            filters.min_length = parseInt(req.query.min_length)
            filtersApplied.min_length = filters.min_length
        }
        if (req.query.max_length !== undefined) {
            filters.max_length = parseInt(req.query.max_length)
            filtersApplied.max_length = filters.max_length
        }
        if (req.query.word_count !== undefined) {
            filters.word_count = parseInt(req.query.word_count)
            filtersApplied.word_count = filters.word_count
        }
        if (req.query.contains_character !== undefined) {
            filters.contains_character = req.query.contains_character
            filtersApplied.contains_character = filters.contains_character
        }
        const strings = await getStrings(filters)
        res.status(200).json({
            data: strings.map(string => transformString(string)),
            count: strings.length,
            filters_applied: filtersApplied
        })
    } catch (error) {
        if (error.code === 400) {
            return res.status(400).json({ message: "Invalid query parameter values or types" })
        }
        res.status(500).json({ message: error.message })
    }
})

router.delete("/:string_value", async (req, res) => {
    const { string_value } = req.params
    try {
        const decodedValue = decodeURIComponent(string_value)
        await deleteStringByValue(decodedValue)
        res.status(204).send()
    } catch (error) {
        if (error.code === 404) {
            return res.status(404).json({ message: "String does not exist in the system" })
        }
        res.status(500).json({ message: error.message })
    }
})

export default router
