export const Decoration = {
    Bold: 'wu__bold',
    Cursive: 'wu__cursive',
    Underline: 'wu__underline',
    Center: 'wu__center',
    Justify: 'wu__justify',
    Left: 'wu__left',
    Right: 'wu__right'
}

export type Decoration = typeof Decoration[keyof typeof Decoration];