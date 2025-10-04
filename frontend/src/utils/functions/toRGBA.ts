/**
 * Converts a hexadecimal color code to its corresponding RGB representation.
 *
 * @param {string} hex - The hexadecimal color code to convert. It should start with a '#' symbol.
 * @param {number} [alpha] - (Optional) The alpha value for the RGBA representation. If not provided, the function will return the RGB representation.
 * @return {string} The RGB or RGBA representation of the hexadecimal color code.
 */
export function toRGBA(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}