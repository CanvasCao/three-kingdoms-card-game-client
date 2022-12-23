export type ElementsUrlJson = {
    baseUrl: string,
    game: { [key: string]: string },
    player: { [key: string]: string },
    other: { [key: string]: string },
}

export type ColorConfigJson = { [key: string]: number }