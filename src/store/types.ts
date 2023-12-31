export interface Pokemon {
    id: number;
    code: string;
    url: string;
    image: string;
    imageDreamWorld: string;
    name: string;
    types: string[];
    stats: any[];
    description: string;
}

export interface PokemonState {
    listPokemon: Pokemon[];
    listTypes: string[];
    loadingList: boolean;
    dataPokemon: Pokemon | null;
}

export interface RootState {
    pokemonModule: PokemonState;
}
