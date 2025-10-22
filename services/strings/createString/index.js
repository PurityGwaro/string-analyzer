import {StringModel} from "../../../models/schema/string.js"
import { checkIfPalindrome } from "../../../helpers/checkIfPalindrome.js"
import { checkUniqueCharacters } from "../../../helpers/checkUniqueCharacters.js"
import { checkWordCount } from "../../../helpers/checkWordCount.js"
import { getCharacterFrequencyMap } from "../../../helpers/getCharacterFrequencyMap.js"
import { hashString } from "../../../helpers/hashString.js"

const createString = async (value) => {
    const hash = hashString(value)
    const stringToCreate = {
        id: hash,
        value,
        properties: {
            length: value.length,
            is_palindrome: checkIfPalindrome(value),
            unique_characters: checkUniqueCharacters(value),
            word_count: checkWordCount(value),
            sha256_hash: hash,
            character_frequency_map: getCharacterFrequencyMap(value)
        }
    }

    return await StringModel.create(stringToCreate)
}

export default createString
