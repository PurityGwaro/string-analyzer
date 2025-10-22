export const checkIfPalindrome = (s) => {
    const isAlphanumeric = (c) => {
        return /[a-z0-9]/i.test(c)
    }
    let left = 0
    let right = s.length - 1

    while (left < right) {
        while (left < right && !isAlphanumeric(s[left])) {
            left++
        }
        while (left < right && !isAlphanumeric(s[right])) {
            right--
        }
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false
        }
        left++
        right--
    }
    return true
}