export function arrayItem(value) {
    return  value ? (value.constructor === Array ? value : [value]) : [];
}