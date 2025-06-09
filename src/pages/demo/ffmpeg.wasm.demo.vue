<template>
    <v-container max-width="800px">
        <video class="mt-4 w-100" :src="video" controls></video>

        <v-btn class="mt-4" width="100%" text="转换为 MP4" @click="transcode()"></v-btn>

        <v-file-upload class="mt-4" v-model="file" density="default"></v-file-upload>

        <v-btn class="mt-4" width="100%" text="将视频转换为图片" @click="toImages()"></v-btn>

        <v-btn class="mt-4" width="100%" text="将图片压缩到zip" @click="images2zip()"></v-btn>

    </v-container>
</template>

<script lang="ts" setup>
import { useFooterStore } from '@/stores/footer';
import type { FSNode, LogEvent } from '@ffmpeg/ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { onMounted, ref, shallowRef } from 'vue'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js'
import { saveAs } from 'file-saver'

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

        await ffmpeg.writeFile('video.mp4', await fetchFile(file.value))

        await ffmpeg.createDir('out')

        ffmpeg.exec(["-i", "video.mp4", "-vf", "fps=30,scale=320:180", "out/%04d.jpg"]);

        footerStore.message = 'Complete video to images'

        const result = await ffmpeg.listDir('/out')

        console.log(result)
    } catch (e) {
        console.log(e)
    }
}

const images2zip = async () => {
    try {
        const zipWriter = new ZipWriter(new BlobWriter("application/zip"));

        const result = await ffmpeg.listDir('/out') as FSNode[]

        for (let index = 0; index < result.length; index++) {
            const element = result[index];

            if (!element.isDir) {
                const data = await ffmpeg.readFile(`/out/${element.name}`)

                const blob = new Blob([data], { type: 'image/png' });

                const blobReader = new BlobReader(blob)

                zipWriter.add(element.name, blobReader)
            }
        }
        const zipFileBlob = await zipWriter.close();

        console.log(zipFileBlob)
        saveAs(zipFileBlob, "file.zip")
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
    })

    footerStore.message = 'Loaded Core'
}

onMounted(() => load())
</script>

<style></style>