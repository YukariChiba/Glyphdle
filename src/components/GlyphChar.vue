<template>
  <v-card :color="color" class="mx-2" :outlined="focused">
    <v-card-title class="justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMinYMin meet"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="text-align: center">
            <ruby>
              <i
                :class="'ig-' + glyph.toLowerCase()"
                class="glyph-char"
                v-if="glyph"
              ></i>
              <i class="glyph-char" v-else>&#12288;</i>
              <rt>{{ glyph }}</rt>
            </ruby>
          </div>
        </foreignObject>
      </svg>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: ["glyph", "color", "focused"],
};
</script>

<style lang="scss" scoped>
.v-card__title {
  padding: 8px;
}
ruby {
  ruby-position: under;
  i {
    font-size: 400px;
  }
  rt {
    margin-top: 40px;
    font-size: 70px;
    font-weight: 300;
  }
}
</style>
