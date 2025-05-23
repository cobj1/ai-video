<template>
    <v-container max-width="800px">
        <video class="mt-4 w-100" :src="video" controls></video>

        <v-btn class="mt-4" width="100%" text="转换为 MP4" @click="transcode()"></v-btn>

        <v-file-upload class="mt-4" v-model="file" density="default"></v-file-upload>

        <v-btn class="mt-4" width="100%" text="将视频转换为图片" @click="toImages()"></v-btn>

    </v-container>
</template>

<script lang="ts" setup>
import { useFooterStore } from '@/stores/footer';
import type { LogEvent } from '@ffmpeg/ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { onMounted, ref, shallowRef } from 'vue'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

const ffmpeg = new FFmpeg()

const video = ref()

const footerStore = useFooterStore()

const file = shallowRef<File>()

const transcode = async () => {
    footerStore.message = 'Start transcoding'

    await ffmpeg.writeFile('video.webm', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm'))

    await ffmpeg.exec(['-i', 'video.webm', 'video.mp4'])

    footerStore.message = 'Complete transcoding'

    const data = await ffmpeg.readFile('video.mp4')

    video.value = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }))
}

const toImages = async () => {
    try {
        footerStore.message = 'Start video to images'

        await ffmpeg.writeFile('video.webm', await fetchFile(file.value))

        await ffmpeg.createDir('out')

        ffmpeg.exec(["-i", "video.webm", "-vf", "fps=1,scale=640:360", "output_%04d.png"]);

        footerStore.message = 'Complete video to images'

        const result = await ffmpeg.listDir('/')

        console.log(result)

    } catch (e) {
        console.log(e)
    }
}

const load = async () => {
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'

    footerStore.message = 'Loading Core'

    ffmpeg.on('log', ({ message: msg }: LogEvent) => {
        footerStore.message = msg
    })
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    })

    footerStore.message = 'Loaded Core'
}

onMounted(() => load())
</script>

<style></style>