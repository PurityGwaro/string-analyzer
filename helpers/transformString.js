export const transformString = (string) => {
    return {
        id: string.id,
        value: string.value,
        properties: string.properties,
        created_at: string.created_at
    }
}