<template>
  <v-app>
    <v-main>
      <v-container class="main-container">
        <v-card>
          <v-card-title class="justify-center mb-4"
            >Glyphdle ({{ $store.getters.guessedTimes }} / 20)</v-card-title
          >
        </v-card>
        <MainGrid />
        <Keyboard />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MainGrid from "./components/MainGrid";
import Keyboard from "./components/Keyboard";

export default {
  name: "App",

  components: {
    MainGrid,
    Keyboard,
  },

  mounted() {
    this.$store.commit("randomSeq");
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss" scoped>
.main-container {
  max-width: 800px;
  min-height: 100vh;
}
</style>
