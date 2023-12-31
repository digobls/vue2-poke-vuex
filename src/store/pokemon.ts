import axios from 'axios';
import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { RootState, PokemonState, Pokemon } from './types';

const state: PokemonState = {
    listPokemon: [],
    listTypes: [],
    loadingList: false,
    dataPokemon: null,
};

const mutations: MutationTree<PokemonState> = {
    setPokemonList(state: PokemonState, listPokemon: Pokemon[]) {
        state.listPokemon = listPokemon;
    },
    setListTypes(state: PokemonState, listTypes: string[]) {
        state.listTypes = listTypes;
    },
    setDetailData(state: PokemonState, payload: Pokemon) {
        state.dataPokemon = payload;
    },
    setIsLoading(state: PokemonState, loading: boolean) {
        state.loadingList = loading;
    },
};

const actions: ActionTree<PokemonState, RootState> = {
    async fetchPokemonList({ commit, state }) {
        if (state.listPokemon.length === 0) {
            try {
                commit('setIsLoading', true);

                const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
                const listTypes: any = [];
                const listResult = await Promise.all(response.data.results.map(async (pokemon: Pokemon) => {
                    // Get pokemon data
                    const pokemonDataResponse = await axios.get(pokemon.url);
                    const pokemonData = pokemonDataResponse.data;

                    // Add types to array
                    pokemonData.types.forEach((type: any) => {
                        const capitalizedType = type.type.name.replace(/^\w/, (c: any) => c.toUpperCase());
                        if (!listTypes.includes(capitalizedType)) {
                            listTypes.push(capitalizedType);
                        }
                    });

                    // Get description of pokemon
                    const pokemonSpeciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}/`);
                    const pokemonSpeciesData = pokemonSpeciesResponse.data;
                    const description = pokemonSpeciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en' && entry.version.name === 'ruby');

                    return {
                        id: pokemonData.id,
                        code: pokemonData.id < 10 ? `#00${pokemonData.id}` : (pokemonData.id < 100 ? `#0${pokemonData.id}` : `#${pokemonData.id}`),
                        name: pokemonData.name,
                        url: pokemon.url,
                        image: pokemonData.sprites?.other?.['official-artwork']?.front_default,
                        imageDreamWorld: pokemonData.sprites?.other?.dream_world?.front_default,
                        description: description?.flavor_text,
                        types: pokemonData?.types?.map((type: any) => type?.type?.name),
                        stats: pokemonData?.stats?.map((stat: any) => ({
                            name: stat?.stat?.name,
                            baseValue: stat?.base_stat,
                        }))
                    };
                }));

                listTypes.sort((a: any, b: any) => a.localeCompare(b));
                commit('setListTypes', listTypes);
                commit('setPokemonList', listResult);
                commit('setIsLoading', false);
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
                commit('setIsLoading', false);
            }
        }
    },
    async fetchPokemonById({ commit }, id: number) {
        try {
            const detailResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const detailData = detailResponse.data;

            // Fetch the species data to get the description
            const speciesResponse = await axios.get(detailData.species.url);
            const speciesData = speciesResponse.data;

            // Find the English description
            const englishDescription = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en' && entry.version.name === 'ruby');

            const parsedPokemon: Pokemon = {
                id: detailData.id,
                code: detailData.id < 10 ? `#00${detailData.id}` : (detailData.id < 100 ? `#0${detailData.id}` : `#${detailData.id}`),
                name: detailData.name,
                url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detailData.id}.png`,
                image: detailData?.sprites?.other['official-artwork']?.front_default,
                imageDreamWorld: detailData?.sprites?.other?.dream_world?.front_default,
                description: englishDescription ? englishDescription.flavor_text : 'No description available',
                types: detailData?.types?.map((type: any) => type?.type?.name),
                stats: detailData?.stats?.map((stat: any) => ({
                    name: stat?.stat?.name,
                    baseValue: stat?.base_stat,
                }))
            };

            commit('setDetailData', parsedPokemon);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    },
};

const getters: GetterTree<PokemonState, RootState> = {
    getPokemonDetailData: state => state.dataPokemon,
    listPokemon: (state: PokemonState) => state.listPokemon,
    listTypes: (state: PokemonState) => state.listTypes,
    loadingList: (state: PokemonState) => state.loadingList,
};

const pokemonModule: Module<PokemonState, RootState> = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};

export default pokemonModule;


// const getters: GetterTree<PokemonState, RootState> = {
//     getPokemonDetailData: state => state.dataPokemon,
//     listPokemon: (state: PokemonState) => state.listPokemon,
//     loadingList: (state: PokemonState) => state.loadingList,
// };
