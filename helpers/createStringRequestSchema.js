import Joi from "joi"

const createStringRequestSchema = Joi.object({
    value: Joi.string().required()
})

const validateCreateStringRequestSchema = (req, res, next) => {
    const { error, value } = createStringRequestSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    req.body = value
    next()
}

export default validateCreateStringRequestSchema
