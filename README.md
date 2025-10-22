# String Analyzer API

A REST API that analyzes strings and stores them with properties like palindrome detection, character frequency, word count, and SHA-256 hash.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/string-analyzer
PORT=3004
```

### 3. Start Server
```bash
node index.js
```

Server runs on `http://localhost:3004`

## API Endpoints

### 1. Create String
**POST** `/strings`

```json
{
  "value": "hello world"
}
```

**Response:**
```json
{
  "id": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
  "value": "hello world",
  "properties": {
    "length": 11,
    "is_palindrome": false,
    "unique_characters": 8,
    "word_count": 2,
    "sha256_hash": "b94d27b9...",
    "character_frequency_map": {
      "h": 1,
      "e": 1,
      "l": 3,
      "o": 2,
      "w": 1,
      "r": 1,
      "d": 1
    }
  },
  "created_at": "2025-10-22T16:59:55.177Z"
}
```

---

### 2. Get String by Value
**GET** `/strings/{string_value}`

```
GET /strings/hello
GET /strings/hello%20world
```

---

### 3. Get All Strings (with filters)
**GET** `/strings`

**Query Parameters:**
- `is_palindrome=true` - Get palindromes only
- `min_length=5` - Minimum length
- `max_length=20` - Maximum length
- `word_count=2` - Exact word count
- `contains_character=a` - Contains specific character

**Examples:**
```
GET /strings
GET /strings?is_palindrome=true
GET /strings?min_length=5&max_length=20
GET /strings?word_count=2&contains_character=a
```

**Response:**
```json
{
  "data": [ /* array of strings */ ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5
  }
}
```

---

### 4. Natural Language Search
**GET** `/strings/filter-by-natural-language?query={your_query}`

**Examples:**
```
GET /strings/filter-by-natural-language?query=all single word palindromic strings
GET /strings/filter-by-natural-language?query=strings longer than 10 characters
GET /strings/filter-by-natural-language?query=strings containing the letter z
```

**Response:**
```json
{
  "data": [ /* matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

---

### 5. Delete String
**DELETE** `/strings/{string_value}`

```
DELETE /strings/hello
DELETE /strings/hello%20world
```

---

## Error Codes

- **200** - Success
- **400** - Bad Request (invalid input)
- **404** - Not Found
- **409** - Conflict (duplicate string)
- **422** - Validation Error
- **500** - Server Error

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Joi (validation)

## Project Structure

```
string-analyzer/
├── helpers/           # Utility functions
├── models/           # MongoDB schemas
├── routes/           # API routes
├── services/         # Business logic
├── index.js          # Entry point
└── .env             # Environment variables
```

## Testing with Postman

1. **Create a string:**
   ```
   POST http://localhost:3004/strings
   Body: { "value": "racecar" }
   ```

2. **Get all strings:**
   ```
   GET http://localhost:3004/strings
   ```

3. **Filter palindromes:**
   ```
   GET http://localhost:3004/strings?is_palindrome=true
   ```

4. **Natural language query:**
   ```
   GET http://localhost:3004/strings/filter-by-natural-language?query=single word palindromic strings
   ```

5. **Delete a string:**
   ```
   DELETE http://localhost:3004/strings/racecar
   ```

---

**Note:** Make sure MongoDB is running before starting the server.
