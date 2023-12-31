<template>
  <a :class="[pokemon.types[0]]" :href="'/detail/' + pokemon.id" class="pokemon-card">
    <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-card__figure" />
    <span class="pokemon-card__code">{{ pokemon.code }}</span>
    <div class="pokemon-card__box">
      <p class="pokemon-card__name">{{ pokemon.name }}</p>
      <div class="pokemon-card__type">
        <img v-for="type in pokemon.types"
             :key="type"
             :src="require(`@/assets/img/types/${type}.svg`)"
             :alt="type"
             class="pokemon-card__image" />
      </div>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
    }
  }
});
</script>

<style scoped lang="scss">
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

@each $type, $color in $color-map {
  .pokemon-card.#{$type} {
    border-color: $color;

    p {
      color: $color;
    }
  }
}

.pokemon-card {
  display: block;
  border-radius: 8px;
  background: $color-white;
  border-width: 25px 0 10px 0;
  border-style: solid;
  text-decoration: none;
  cursor: pointer;

  &__code {
    position: absolute;
    top: -22px;
    left: 9px;
    font-family: $font-family-fira;
    color: $color-white;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 450;
    line-height: normal;
  }

  &__figure {
    position: absolute;
    right: 0;
    bottom: -9px;
    width: 100px;
    height: 100px;
  }

  &__box {
    height: 65px;
    width: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }

  &__type {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    top: -1px;
    right: 111px;
    margin: auto;
    height: 65px;
  }

  &__image {
    max-width: 18px;
    margin-bottom: 9px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__name {
    font-family: $font-family-fira;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 0;
    margin: 0;
    text-transform: capitalize;
  }
}

@media only screen and (min-width: 581px) {
  .pokemon-card {
    width: 100%;
    position: relative;

    &__code {
      left: unset;
      right: 5px;
    }

    &__figure {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 50px;
      margin: 0 auto;
    }

    &__box {
      justify-content: center;
      flex-direction: column;
    }

    &__type {
      top: 0;
      right: unset;
      left: 10px;
    }

    &__name {
      font-weight: 450;
    }
  }
}
</style>
