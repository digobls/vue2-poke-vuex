import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import pokemonModule from './pokemon';
import { RootState } from './types';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
    modules: {
        pokemonModule,
    },
};

export default new Vuex.Store<RootState>(store);
