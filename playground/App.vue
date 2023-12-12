<script setup lang="ts">
import { useDocumentPictureInPicture, usePictureInPicture } from '@'
import { ref } from 'vue'

const dpip = ref<HTMLDivElement | null>(null)

const udpip = useDocumentPictureInPicture(dpip)

const pip = ref<HTMLVideoElement | null>(null)

const upip = usePictureInPicture(pip)
</script>

<template>
  <div>sky-hooks</div>

  <div id="document-picture-in-picture">
    <div ref="dpip">document-picture-in-picture</div>
    <div class="support">{{ udpip.isSupported }}</div>
    <div class="status">{{ udpip.isDocumentPictureInPicture }}</div>
    <button class="enter" @click="udpip.enter()">enter</button>
    <button class="exit" @click="udpip.exit()">exit</button>
    <button class="toggle" @click="udpip.toggle()">toggle</button>
  </div>

  <div id="picture-in-picture">
    <video ref="pip" class="video" src="/video.mp4" width="300" height="200"></video>
    <div class="support">{{ upip.isSupported }}</div>
    <div class="status">{{ upip.isPictureInPicture }}</div>
    <button class="enter" @click="upip.enter()">enter</button>
    <button class="exit" @click="upip.exit()">exit</button>
    <button class="toggle" @click="upip.toggle()">toggle</button>
  </div>
</template>

<style scoped lang="scss"></style>
