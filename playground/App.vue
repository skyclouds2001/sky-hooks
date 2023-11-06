<script setup lang="ts">
import { useDocumentPictureInPicture } from '@';
import { ref } from 'vue';

const dpip = ref<HTMLDivElement | null>(null)

const udipi = useDocumentPictureInPicture(dpip)
</script>

<template>
  <div>sky-hooks</div>

  <div id="document-picture-in-picture">
    <div ref="dpip">document-picture-in-picture</div>
    <div class="support">{{ udipi.isSupported }}</div>
    <div class="status">{{ udipi.isDocumentPictureInPicture }}</div>
    <button class="enter" @click="udipi.enter()">enter</button>
    <button class="exit" @click="udipi.exit()">exit</button>
    <button class="toggle" @click="udipi.toggle()">toggle</button>
  </div>
</template>

<style scoped lang="scss"></style>
