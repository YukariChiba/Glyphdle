<template>
  <v-footer fixed class="justify-center kb-footer">
    <v-card tile width="100%">
      <v-card-actions class="d-flex" v-if="!$store.state.status">
        <v-btn
          :disabled="$store.getters.seqEmpty"
          color="warning"
          @click="$store.commit('delGlyph')"
          >Remove</v-btn
        >
        <v-btn
          :disabled="$store.getters.seqFinished"
          class="flex-grow-1"
          @click="keyboard = !keyboard"
          color="primary"
          ><v-icon left>mdi-keyboard</v-icon> Keyboard</v-btn
        >
        <v-btn
          @click="submit"
          color="success"
          :disabled="!$store.getters.seqFinished"
          >Enter</v-btn
        >
      </v-card-actions>
      <v-card-actions class="d-flex" v-else>
        <v-btn @click="share" class="flex-grow-1" color="primary"
          ><v-icon left>mdi-share</v-icon> Share</v-btn
        >
        <v-btn @click="reset" class="flex-grow-1" color="default"
          ><v-icon left>mdi-refresh</v-icon> Reset</v-btn
        >
      </v-card-actions>
      <v-divider v-if="keyboardShow" />
      <div>
        <v-expand-transition>
          <v-card-actions v-if="keyboardShow" class="justify-center">
            <GlyphInput v-on:inputGlyph="newChar" />
          </v-card-actions>
        </v-expand-transition>
      </div>
    </v-card>
  </v-footer>
</template>

<script>
import Glyphs from "@/data/Glyph.json";
import GlyphInput from "@/components/GlyphInput";
import { genShare } from "@/utils/GenShare.js";

export default {
  data: () => ({
    keyboard: false,
    glyphs: Glyphs,
  }),
  computed: {
    keyboardShow() {
      return (
        !this.$store.getters.seqFinished &&
        this.keyboard &&
        !this.$store.state.status
      );
    },
  },
  components: {
    GlyphInput,
  },
  methods: {
    share() {
      navigator.clipboard.writeText(
        genShare(
          this.$store.state.guessedSeq,
          this.$store.state.seq,
          this.$store.state.seqID
        )
      );
    },
    newChar: function (g) {
      this.$store.commit("addGlyph", g);
    },
    submit() {
      this.$store.commit("guessGlyph");
      this.$vuetify.goTo("#glyphcol");
    },
    reset() {
      this.$store.commit("reset");
      this.$store.commit("randomSeq");
    },
  },
};
</script>

<style lang="scss" scoped>
.kb-footer {
  padding: 0;
}
</style>
