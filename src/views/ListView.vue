<template>
  <section>
    <div class="block-list">
      <!-- Search -->
      <div v-if="!loadingList" class="pokemon-search">
        <input v-model="pokemonName" type="text" placeholder="Search" class="pokemon-search__input" />

        <select v-model="pokemonType" class="pokemon-search__select">
          <option value="">Show All</option>
          <option v-for="type in listTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- List -->
      <div v-if="isSearch" class="container-list">
        <div v-for="pokemon in listSearch" :key="pokemon.code" class="container-list__card">
          <PokemonCard :pokemon="pokemon" />
        </div>
      </div>
      <div v-else class="container-list">
        <div v-for="pokemon in listPokemon" :key="pokemon.code" class="container-list__card">
          <PokemonCard :pokemon="pokemon" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loadingList" class="container-loading">
        <a v-for="index in 151" :key="index" class="list-card">
          <p class="list-card--loading-adjust loading-on-element-custom"></p>
        </a>
      </div>

      <!-- Empty search -->
      <div v-if="isSearch && !listSearch?.length && !loadingList" class="container-empty-search">
        <p class="container-empty-search__text">Pokemon not found.</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import PokemonCard from "@/components/PokemonCard.vue";

export default Vue.extend({
  name: 'ListView',
  components: {
    PokemonCard
  },
  data() {
    return {
      pokemonName: '',
      pokemonType: '',
      listSearch: [],
      isSearch: false
    }
  },
  computed: {
    ...mapGetters('pokemonModule', ['listPokemon', 'listTypes', 'loadingList']),
  },
  methods: {
    ...mapActions('pokemonModule', ['fetchPokemonList']),
    searchPokemon() {
      if (this.pokemonName || this.pokemonType) {
        this.isSearch = true;
        this.listSearch = this.listPokemon.filter((pokemon: any) => {
          const hasName = pokemon.name.toLowerCase().includes(this.pokemonName?.toLowerCase());
          const hasType = !this.pokemonType || pokemon.types.includes(this.pokemonType?.toLowerCase());
          return hasName && hasType;
        });
      } else {
        this.isSearch = false;
        this.listSearch = this.listPokemon;
      }
    },
  },
  created() {
    this.fetchPokemonList();
  },
  watch: {
    pokemonName: 'searchPokemon',
    pokemonType: 'searchPokemon',
  },
});
</script>

<style lang="scss" scoped>
$color-white: #fff;
$font-family-fira: 'Fira Code', monospace;
$color-gray: #ccc;
$color-map: (
    normal: #A8A878,
    fighting: #C03028,
    poison: #A040A0,
    ground: #E0C068,
    rock: #B8A038,
    bug: #A8B820,
    dragon: #7038F8,
    ghost: #705898,
    dark: #705848,
    fairy: #EE99AC,
    fire: #F08030,
    water: #6890F0,
    grass: #78C850,
    electric: #F8D030,
    steel: #B8B8D0,
    psychic: #F85888,
    ice: #98D8D8,
    flying: #A890F0
);

@function get-pokemon-color($type) {
  @return map-get($color-map, $type);
}

section {
  background-image: url('/src/assets/img/global/pokemon-bg.png');
  background-repeat: repeat;
  min-height: 100vh;

  .block-list {
    padding: 83px 0;
    position: relative;

    .pokemon-search {
      width: calc(100% - 40px);
      display: block;
      margin: 0 auto;

      &__input,
      &__select {
        border-radius: 100px;
        border: 1px solid $color-gray;
        background-color: $color-white;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
        display: block;
        height: 30px;
        font-family: $font-family-fira;
        font-size: 10px;
        color: $color-gray;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        padding: 0 10px;
        background-repeat: no-repeat;
        background-position: right 10px center;

        &::before {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          width: 12px;
          height: 14px;
          background-size: contain;
        }
      }

      &__input {
        width: calc(100% - 22px);
        background-image: url('/src/assets/img/icons/search.svg');

        &::placeholder {
          color: $color-gray;
        }
      }

      &__select {
        width: 100%;
        margin: 17px 0 30px;
        appearance: none;
        background-image: url('/src/assets/img/icons/arrow.svg');
        -webkit-appearance: none;
        -moz-appearance: none;

        option {
          font-family: $font-family-fira;
          font-size: 10px;
          color: $color-gray;
        }
      }
    }

    .container-list {
      &__card {
        width: calc(100% - 40px);
        display: block;
        position: relative;
        height: 65px;
        padding: 0;
        margin: 0 auto 15px;
      }
    }

    @media only screen and (min-width: 581px) {
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      max-width: 860px;
      width: 100%;
      margin: 0 auto;

      .pokemon-search {
        width: 100%;
        margin: 90px 0 70px;
        text-align: right;

        &__input,
        &__select {
          margin: 0;
          width: 100%;
          max-width: 200px;
          display: inline-block;
        }

        &__input {
          max-width: calc(200px - 22px);
          margin-right: 21px;
        }
      }

      .container-list {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        &__card {
          width: calc(25% - 20px);
          max-width: 200px;
          max-height: 156px;
          margin: 10px 10px 100px;
        }
      }
    }
  }

  .container-loading {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .list-card {
      border-color: #ccc;

      &--loading-adjust {
        height: 100%;
        position: relative;
        top: -20px;
      }
    }

    @media only screen and (min-width: 581px) {
      margin-top: 73px;

      .list-card {
        margin-bottom: 10px;
      }
    }
  }

  .container-empty-search {
    display: block;
    width: 100%;

    &__text {
      font-family: $font-family-fira;
      color: $color-white;
      text-align: center;
      font-size: 26px;
      font-style: normal;
      font-weight: 450;
      line-height: normal;
    }
  }
}
</style>
