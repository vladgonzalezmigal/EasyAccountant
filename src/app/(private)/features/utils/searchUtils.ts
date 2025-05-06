export function filterByStartsWith(list: string[], query: string): string[] {
    return list.filter(item => item.toLowerCase().startsWith(query.toLowerCase()));
}