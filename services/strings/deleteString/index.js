import { StringModel } from "../../../models/schema/string.js"
import { transformString } from "../../../helpers/transformString.js"

const deleteStringById = async (id) => {
    try {
        const string = await StringModel.findByIdAndDelete(id)
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

const deleteStringByValue = async (value) => {
    try {
        const string = await StringModel.findOneAndDelete({ value })
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

export { deleteStringById, deleteStringByValue }