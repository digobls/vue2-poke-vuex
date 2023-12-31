<template>
  <div class="block-list">
    <div v-if="dataPokemon" class="box-data">
      <div class="box-data__pokemon">
        <img :src="dataPokemon.imageDreamWorld" :alt="dataPokemon.name" class="box-data__image" />
        <h2 class="box-data__name">{{ dataPokemon.code }} {{ dataPokemon.name }}</h2>
        <div class="box-data__bg-bottom" :style="{ backgroundImage: `url(${currentSvgDataUrl})` }">
          <div class="box-data__bg-bottom hover" :style="{ backgroundImage: `url(${currentSvgDataUrl})` }">
          </div>
        </div>
      </div>

      <div class="box-data__box-description">
        <h4 class="box-data__sub-title">Descrição</h4>
        <div class="box-data__line-color" :class="getColorClass(dataPokemon.types)"></div>
        <p class="box-data__description">
          <span class="box-data__description-name">{{ dataPokemon.name }}</span>
          {{ dataPokemon.description }}
        </p>

        <div class="box-data__type-container">
          <div v-for="type in dataPokemon.types" :key="type" class="box-data__type">
            <img :src="require(`@/assets/img/types/${type}.svg`)" :alt="type" class="box-data_image-type" />
            <span class="box-data__name-type">{{ type }}</span>
          </div>
        </div>
        <h4 class="box-data__sub-title">Estatistica</h4>
        <div class="box-data__line-color" :class="getColorClass(dataPokemon.types)"></div>
        <ul class="box-data__stats">
          <li v-for="stat in dataPokemon.stats" :key="stat.name" class="box-data__stat">
            <span class="box-data__stat-name"> {{ getAbbreviatedStatName(stat.name) }}</span>
            <div class="box-data__progress-bar">
              <div class="box-data__progress-fill" :style="{ width: stat.baseValue + '%' }" :class="getTypeClass(dataPokemon.types)"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  name: 'DetailView',
  props: ['pokemonId'],
  data() {
    return {
      svgUrlHillBig: '',
      svgUrlHillSmall: '',
      currentSvgDataUrl: '',
      colorMap: new Map([
        ['normal', '#A8A878'],
        ['fighting', '#C03028'],
        ['poison', '#A040A0'],
        ['ground', '#E0C068'],
        ['rock', '#B8A038'],
        ['bug', '#A8B820'],
        ['ghost', '#705898'],
        ['steel', '#B8B8D0'],
        ['fire', '#F08030'],
        ['water', '#6890F0'],
        ['grass', '#78C850'],
        ['electric', '#F8D030'],
        ['psychic', '#F85888'],
        ['ice', '#98D8D8'],
        ['dragon', '#7038F8'],
        ['dark', '#705848'],
        ['fairy', '#EE99AC'],
        ['flying', '#A890F0']
      ])
    }
  },
  computed: {
    ...mapGetters('pokemonModule', ['dataPokemon', 'loadingData']),
  },
  methods: {
    ...mapActions('pokemonModule', ['fetchPokemonById']),
    getColorClass(types: any) {
      return `background-${types[0]}`
    },
    getAbbreviatedStatName(statName: string) {
      switch (statName) {
        case 'hp':
          return 'HP';
        case 'attack':
          return 'ATK';
        case 'defense':
          return 'DEF';
        case 'special-attack':
          return 'SpP';
        case 'special-defense':
          return 'SpD';
        case 'speed':
          return 'spd';
      }
    },
    getTypeClass(types: any) {
      return `type-${types[0]}`
    },
    async generateSvgDataUrl(svgUrl: string, color: any) {
      const response = await fetch(svgUrl);
      const svgText = await response.text();
      const modifiedSvgText = svgText.replace(/fill="#[A-Fa-f0-9]+"/, `fill="${color}"`);
      const svgBlob = new Blob([modifiedSvgText], { type: 'image/svg+xml' });
      return URL.createObjectURL(svgBlob);
    },
    setColorByType() {
      const type = this.dataPokemon?.types[0]?.toLowerCase();
      const color = this.colorMap.get(type || 'transparent');

      this.generateSvgDataUrl(require('@/assets/img/icons/hillBig.svg'), color).then((svgUrl) => {
        this.svgUrlHillBig = svgUrl;
        this.currentSvgDataUrl = window.innerWidth > 580 ? this.svgUrlHillBig : this.svgUrlHillSmall;
      })
      this.generateSvgDataUrl(require('@/assets/img/icons/hillSmall.svg'), color).then((svgUrl) => {
        this.svgUrlHillSmall = svgUrl;
        this.currentSvgDataUrl = window.innerWidth > 580 ? this.svgUrlHillBig : this.svgUrlHillSmall;
      })
    },
    handleResize() {
      this.currentSvgDataUrl = window.innerWidth > 580 ? this.svgUrlHillBig : this.svgUrlHillSmall;
    }
  },
  created() {
    this.fetchPokemonById(this.$route.params.id);
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  watch: {
    dataPokemon: 'setColorByType'
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
});
</script>

<style lang="scss" scoped>
$color-white: #fff;
$font-family-fira: 'Fira Code', monospace;
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

@each $type, $color in $color-map {
  .type-#{$type} {
    background-color: $color;
  }

  .background-#{$type} {
    background: $color;
  }
}

.block-list {
  background-image: url('/src/assets/img/global/pokemon-bg.png');
  background-repeat: repeat;
  min-height: 100vh;
}

.box-data {
  position: relative;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;

  &__pokemon {
    padding: 20px;
    position: relative;
  }

  &__bg-bottom {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .hover {
    opacity: 0.5;
    bottom: 18px;
  }

  &__image {
    position: relative;
    background: transparent;
    width: 100%;
    max-width: 200px;
    display: block;
    object-fit: cover;
    margin: 70px auto 0;
    z-index: 2;
  }

  &__name {
    position: relative;
    color: $color-white;
    text-align: center;
    font-family: $font-family-fira;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    text-transform: capitalize;
    z-index: 2;
    margin: 0;
    height: 40px;
    line-height: 55px;
  }

  &__sub-title {
    color: $color-white;
    text-align: center;
    font-family: $font-family-fira;
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
    margin: 0;
    height: 60px;
    line-height: 50px;
  }

  &__line-color {
    width: calc(100% + 40px);
    height: 2px;
    position: relative;
    left: -20px;
  }

  &__box-description {
    padding: 20px 20px 40px;
    background: #2C2C2D;
    box-shadow: none;
  }

  &__description {
    color: $color-white;
    text-align: center;
    font-family: $font-family-fira;
    font-size: 14px;
    font-style: normal;
    font-weight: 450;
    line-height: 15px;
    margin-top: 20px;
  }

  &__description-name {
    text-transform: uppercase;
    margin-right: 6px;
    display: inline-block;
  }

  &__type-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0 23px;
  }

  &__type {
    display: flex;
    align-items: center;

    &:first-of-type {
      margin-right: 40px;
    }
  }

  &__image-type {
    margin-right: 10px;
    max-width: 52px;
  }

  &__name-type {
    font-family: $font-family-fira;
    color: $color-white;
    text-align: center;
    text-transform: capitalize;
    font-size: 14px;
    font-style: normal;
    font-weight: 450;
    line-height: 15px;
    margin-left: 10px;
    position: relative;
    top: 4px;
  }

  &__stats {
    display: block;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 33px 0 0;
  }

  &__stat {
    display: flex;
    align-items: center;
    margin-bottom: 17px;
  }

  &__stat-name {
    color: $color-white;
    font-family: $font-family-fira;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 10px;
    margin-right: 14px;
    min-width: 32px;
    text-align: right;
  }

  &__progress-bar {
    width: 100%;
    height: 20px;
    border-radius: 10px;
    background: #C4C4C4;
    overflow: hidden;
    margin-top: 10px;
    display: inline-block;
    position: relative;
    top: -4px;
  }

  &__progress-fill {
    height: 100%;
  }

  @media only screen and (min-width: 581px) {
    display: flex;
    justify-content: center;

    &__pokemon {
      padding: 0;
    }

    &__bg-bottom {
      position: fixed;
      height: 352px;
      width: 100vw;
      background-position: 50% 0;
    }

    &__image {
      width: 362px;
      max-width: 362px;
      margin-top: 197px;
    }

    &__name {
      font-size: 45px;
      white-space: nowrap;
      margin-top: 20px;
    }

    &__box-description {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      margin: 73px 0 0 48px;
      border-radius: 4px;
      box-shadow: 0 0 10px 0 #000;
      padding: 20px 2px 0;
      max-height: 620px;
    }

    &__stats {
      margin-top: 11px;
    }

    &__stat-name {
      font-size: 25px;
      min-width: 45px;
    }

    &__line-color {
      left: 0;
      width: 100%;
    }

    &__stats {
      padding: 20px;
    }

    &__progress-bar {
      width: 80%;
      max-width: 315px;
    }

    &__name-type {
      font-size: 25px;
      min-width: 46px;
    }
  }
}
</style>
