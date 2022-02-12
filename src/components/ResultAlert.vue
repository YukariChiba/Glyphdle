<template>
  <div>
    <v-alert v-if="$store.state.status == 2" color="warning">
      <div class="text-h6">Failed！</div>
      Click SHARE button below to share your results. Click RESET to try again.
    </v-alert>
    <v-alert v-if="$store.state.status == 1" color="success">
      <div class="text-h6">Success!</div>
      Click SHARE button below to share your results. Click RESET to reset the
      game.
    </v-alert>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
