import express from "express";
import { StringModel } from "../models/schema/string.js";
import { hashString } from "../helpers/hashString.js";
import { checkIfPalindrome } from "../helpers/checkIfPalindrome.js";
import { checkUniqueCharacters } from "../helpers/checkUniqueCharacters.js";
import { checkWordCount } from "../helpers/checkWordCount.js";
import { getCharacterFrequencyMap } from "../helpers/getCharacterFrequencyMap.js";
import { parseNaturalLanguageQuery } from "../helpers/parseNaturalLanguage.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { value } = req.body;

    if (!value)
      return res
        .status(400)
        .json({ error: 'Invalid request body or missing "value" field' });

    if (typeof value !== "string")
      return res
        .status(422)
        .json({ error: 'Invalid data type for "value" (must be string)' });

    const hash = hashString(value);
    const stringProperties = {
      id: hash,
      value: value,
      properties: {
        length: value.length,
        is_palindrome: checkIfPalindrome(value),
        unique_characters: checkUniqueCharacters(value),
        word_count: checkWordCount(value),
        sha256_hash: hash,
        character_frequency_map: getCharacterFrequencyMap(value),
      },
      created_at: new Date().toISOString(),
    };
    const newString = new StringModel(stringProperties);
    await newString.save();

    res.status(201).json(stringProperties);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "String already exists in the system" });
    }
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

router.get("/filter-by-natural-language", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: "Query parameter 'query' is required." });
    }

    const parsedFilters = parseNaturalLanguageQuery(query);
    
    const filter = {};
    
    if (parsedFilters.is_palindrome !== undefined) {
      filter["properties.is_palindrome"] = parsedFilters.is_palindrome;
    }
    if (parsedFilters.word_count !== undefined) {
      filter["properties.word_count"] = parsedFilters.word_count;
    }
    if (parsedFilters.min_length !== undefined) {
      filter["properties.length"] = filter["properties.length"] || {};
      filter["properties.length"].$gt = parsedFilters.min_length - 1;
    }
    if (parsedFilters.max_length !== undefined) {
      filter["properties.length"] = filter["properties.length"] || {};
      filter["properties.length"].$lt = parsedFilters.max_length + 1;
    }
    if (parsedFilters.contains_character !== undefined) {
      filter.value = { $regex: parsedFilters.contains_character, $options: "i" };
    }

    const strings = await StringModel.find(filter);

    res.status(200).json({
      data: strings,
      count: strings.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    });
  } catch (err) {
    if (err.code === 400) {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 422) {
      return res.status(422).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;

    const filter = {};

    if (is_palindrome !== undefined) {
      filter["properties.is_palindrome"] = is_palindrome === "true";
    }
    if (min_length) {
      filter["properties.length"] = {
        ...(filter["properties.length"] || {}),
        $gte: parseInt(min_length, 10),
      };
    }
    if (max_length) {
      filter["properties.length"] = {
        ...(filter["properties.length"] || {}),
        $lte: parseInt(max_length, 10),
      };
    }
    if (word_count) {
      filter["properties.word_count"] = parseInt(word_count, 10);
    }
    if (contains_character) {
      filter.value = { $regex: contains_character, $options: "i" };
    }

    const strings = await StringModel.find(filter);
    const appliedFilters = {};
    for (const key in req.query) {
      if (req.query[key] !== undefined) {
        appliedFilters[key] = req.query[key];
      }
    }
    res.status(200).json({
      data: strings,
      count: strings.length,
      filters_applied: appliedFilters,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:string_value", async (req, res) => {
  try {
    const string = await StringModel.findOne({
      value: req.params.string_value,
    });
    if (!string) return res.status(404).json({ error: "String not found" });
    res.status(200).json(string);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:string_value", async (req, res) => {
  try {
    const string = await StringModel.findOneAndDelete({
      value: req.params.string_value,
    });

    if (!string) {
      return res
        .status(404)
        .json({ error: "String does not exist in the system" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
