import Joi from "joi"

const getStringsQuerySchema = Joi.object({
    is_palindrome: Joi.boolean(),
    min_length: Joi.number().integer().min(0),
    max_length: Joi.number().integer().min(0),
    word_count: Joi.number().integer().min(0),
    contains_character: Joi.string().length(1)
})

const validateGetStringsQuery = (req, res, next) => {
    const { error } = getStringsQuerySchema.validate(req.query)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    next()
}
export default validateGetStringsQuery