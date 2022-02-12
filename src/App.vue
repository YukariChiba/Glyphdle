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
    let pid = parseInt(location.hash.substring(1));
    if (pid >= 0 && pid < this.$store.getters.allSeqsLength) {
      this.$store.commit("setSeq", pid);
    } else {
      this.$store.commit("randomSeq");
    }
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  max-width: 800px;
  min-height: 100vh;
}
</style>
