<template>
  <div class="main-grid">
    <div
      class="d-flex glyph-char-row mb-2"
      v-for="(seq, i) in $store.state.guessedSeq"
      :key="i"
    >
      <glyph-char
        :glyph="g"
        :color="getColor(g, i)"
        class="flex-grow-1 flex-shrink-1"
        v-for="(g, i) in seq"
        :key="i"
      />
    </div>
    <div class="d-flex glyph-char-row mb-2" v-if="!$store.state.status">
      <glyph-char
        :glyph="g"
        id="glyphcol"
        color="default"
        class="flex-grow-1 flex-shrink-1"
        :focused="i == currentIndex"
        v-for="(g, i) in currentSeqProcessed"
        :key="i"
      />
    </div>
    <result-alert />
  </div>
</template>

<script>
import GlyphChar from "@/components/GlyphChar";
import ResultAlert from "@/components/ResultAlert.vue";

export default {
  components: {
    GlyphChar,
    ResultAlert,
  },
  methods: {
    getColor(g, i) {
      let trueSeq = this.$store.state.seq;
      let ret = "default";
      if (trueSeq.includes(g)) {
        ret = "orange";
      }
      if (trueSeq[i] === g) {
        ret = "success";
      }
      return ret;
    },
  },
  computed: {
    currentIndex() {
      return this.$store.state.currentSeq.length;
    },
    currentSeqProcessed() {
      if (this.$store.state.currentSeq.length == 5)
        return this.$store.state.currentSeq;
      else {
        let realSeq = [];
        realSeq = realSeq.concat(this.$store.state.currentSeq);
        for (let i = 0; i < 5 - this.$store.state.currentSeq.length; i++) {
          realSeq.push("");
        }
        return realSeq;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-grid {
  padding-bottom: 70vh;
}
</style>
