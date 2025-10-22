import Joi from "joi"

const createStringRequestSchema = Joi.object({
    value: Joi.string().required()
})

const validateCreateStringRequestSchema = (req, res, next) => {
    const { error, value } = createStringRequestSchema.validate(req.body)
    if (error) {
        const errorMessage = error.details[0].message
        // Check if 'value' field is missing
        if (errorMessage.includes('"value" is required')) {
            return res.status(400).json({ message: 'Invalid request body or missing "value" field' })
        }
        // Check if 'value' is not a string
        if (errorMessage.includes('"value" must be a string')) {
            return res.status(422).json({ message: 'Invalid data type for "value" (must be string)' })
        }
        return res.status(400).json({ message: errorMessage })
    }
    req.body = value
    next()
}

export default validateCreateStringRequestSchema
