<template>
    <div class="preview-area d-flex flex-column h-100 w-100 bg-black">
        <div class="preview-canvas-wrapper flex-grow-1 d-flex justify-center align-center position-relative">
            <canvas ref="previewCanvas" class="preview-canvas"></canvas>
            <PreviewEditorOverlay :viewport-scale="viewportScale" />
        </div>
        <!-- <div class="preview-controls pa-2 d-flex justify-center align-center bg-grey-darken-3">
            <v-btn icon @click="togglePlay" :disabled="!movie">
                <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>

            <span class="text-white ml-4">{{ formatTime(timelineStore.currentPlayheadFrame) }} / {{
                formatTime(timelineStore.contentDurationFrames) }}</span>

        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Movie } from 'etro';
import * as etro from 'etro'; // 导入整个 etro 命名空间，以便访问 etro.layer
import { useTimelineStore } from '@/stores/timeline';
import type { Clip, Track } from '@/types/timeline';


// 接收 viewportScale prop
const props = defineProps<{
    viewportScale: number;
}>();

// const timelineStore = useTimelineStore();

// const previewCanvas = ref<HTMLCanvasElement | null>(null);
// let movie: Movie | null = null;
// const isPlaying = ref(false);

// // 辅助函数 (保持不变)
// const formatTime = (frames: number): string => {
//     if (isNaN(frames) || frames < 0) return '00:00:00:00';
//     const totalSeconds = frames / timelineStore.frameRate;
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = Math.floor(totalSeconds % 60);
//     const remainingFrames = frames % timelineStore.frameRate;

//     const hh = String(hours).padStart(2, '0');
//     const mm = String(minutes).padStart(2, '0');
//     const ss = String(seconds).padStart(2, '0');
//     const ff = String(remainingFrames).padStart(2, '0');

//     return `${hh}:${mm}:${ss}:${ff}`;
// };
// const framesToSeconds = (frames: number): number => {
//     return frames / timelineStore.frameRate;
// };
// const secondsToFrames = (seconds: number): number => {
//     return Math.round(seconds * timelineStore.frameRate);
// };

// // 配置 etro.js 图层，现在会使用 Clip 的视觉属性
// const configureEtroLayers = async () => {
//     if (!movie) return;

//     movie.layers = [];
//     console.log("Clearing existing etro.js layers for re-configuration.");

//     for (const track of timelineStore.tracks) {
//         for (const clip of track.clips) {
//             // 为 etro.js Layer 准备选项，包括新增的视觉属性
//             let layerOptions: any = {
//                 startTime: framesToSeconds(clip.startFrame),
//                 x: clip.x,
//                 y: clip.y,
//                 scale: [clip.scaleX, clip.scaleY], // etro.js scale takes an array [scaleX, scaleY]
//                 rotation: clip.rotation,
//                 opacity: clip.opacity,
//             };

//             let layer;
//             switch (clip.mediaType) {
//                 case 'video':
//                     layer = new etro.layer.Video({
//                         source: clip.mediaSourcePath,
//                         ...layerOptions,
//                     });
//                     console.log(`Adding video layer: ${clip.name} with options:`, layerOptions);
//                     break;
//                 case 'image':
//                     layer = new etro.layer.Image({
//                         source: clip.mediaSourcePath,
//                         duration: framesToSeconds(clip.durationFrames), // Image layers need explicit duration
//                         ...layerOptions,
//                     });
//                     console.log(`Adding image layer: ${clip.name} with options:`, layerOptions);
//                     break;
//                 case 'audio':
//                     layer = new etro.layer.Audio({
//                         source: clip.mediaSourcePath,
//                         ...layerOptions, // etro.js audio layers can also have visual properties for effects
//                     });
//                     console.log(`Adding audio layer: ${clip.name} with options:`, layerOptions);
//                     break;
//                 default:
//                     console.warn(`Unsupported media type: ${clip.mediaType} for clip: ${clip.name}`);
//                     break;
//             }

//             if (layer) {
//                 movie.addLayer(layer);
//             }
//         }
//     }
//     console.log("Etro.js layers configured:", movie.layers.length, "layers.");

//     // 加载所有媒体
//     await movie.load();
//     console.log("Etro.js media loaded.");

//     // 根据 etro.Movie 推断出的总时长，更新 timelineStore 的总帧数
//     timelineStore.setContentDuration(secondsToFrames(movie.duration));
//     console.log(`Etro.js movie duration: ${movie.duration}s, updated timelineStore.contentDurationFrames to ${timelineStore.contentDurationFrames} frames.`);

//     // 刷新预览到当前播放头位置
//     updatePreviewFrame(timelineStore.currentPlayheadFrame);
// };

// // 初始化 Etro.Movie (保持不变，但会调用新的 configureEtroLayers)
// const initEtroMovie = async () => {
//     if (!previewCanvas.value) {
//         console.error("Canvas element not found!");
//         return;
//     }

//     if (movie) {
//         console.log("Destroying existing etro.Movie instance.");
//         movie.pause();
//         movie.destroy();
//         movie = null;
//     }

//     try {
//         movie = new Movie({
//             canvas: previewCanvas.value,
//             repeat: false,
//         });

//         movie.on('play', () => { isPlaying.value = true; });
//         movie.on('pause', () => { isPlaying.value = false; });
//         movie.on('ended', () => {
//             isPlaying.value = false;
//             timelineStore.setPlayheadFrame(0);
//             updatePreviewFrame(0);
//         });

//         movie.on('timeupdate', () => {
//             const currentSeconds = movie?.currentTime || 0;
//             if (!timelineStore.isPlayheadDragging) {
//                 timelineStore.setPlayheadFrame(secondsToFrames(currentSeconds));
//             }
//         });

//         console.log("Etro.Movie initialized.");
//         await configureEtroLayers(); // 调用新的配置函数

//     } catch (error) {
//         console.error("Failed to initialize Etro.Movie:", error);
//     }
// };

// // 播放控制 (保持不变)
// const togglePlay = () => {
//     if (!movie) return;
//     if (isPlaying.value) {
//         movie.pause();
//     } else {
//         movie.play(framesToSeconds(timelineStore.currentPlayheadFrame));
//     }
// };

// // 更新预览画面 (保持不变，但会触发 etro.js 绘制)
// const updatePreviewFrame = (frame: number) => {
//     if (movie) {
//         movie.currentTime = framesToSeconds(frame);
//         movie.refresh();
//     }
// };

// // --- Watchers ---
// // 监听播放头变化
// watch(() => timelineStore.currentPlayheadFrame, (newFrame) => {
//     if (!isPlaying.value) {
//         updatePreviewFrame(newFrame);
//     }
// });

// // 监听时间轴数据变化，包括 Clip 的视觉属性，触发 etro.js 重新配置
// watch(() => timelineStore.tracks, async () => {
//     console.log("Timeline tracks data (including clip properties) changed, re-initializing etro.Movie...");
//     await initEtroMovie();
// }, { deep: true }); // deep: true 是关键，确保能监听到 Clip 内部属性变化

// // 监听帧率变化 (保持不变)
// watch(() => timelineStore.frameRate, async () => {
//     console.log("Timeline frameRate changed, re-initializing etro.Movie...");
//     await initEtroMovie();
// }, { deep: true });

// onMounted(async () => {
//     await nextTick();
//     if (timelineStore.contentDurationFrames === 0 && timelineStore.tracks.length === 0) {
//         // 确保有初始数据，以便 etro.js 能加载
//         timelineStore.setFrameRate(30);
//         timelineStore.setContentDuration(900); // 30秒
//         timelineStore.addTrack({ id: 'track-1', name: 'Track 1', clips: [] });
//         timelineStore.addTrack({ id: 'track-2', name: 'Track 2', clips: [] });

//         // 添加一个示例视频剪辑，带有初始视觉属性
//         timelineStore.addClipToTrack('track-1', {
//             id: 'video-clip-1',
//             name: 'Sample Video',
//             mediaType: 'video',
//             mediaSourcePath: '/videos/sample.mp4', // 请确保你有一个可访问的视频文件在此路径
//             startFrame: 0,
//             durationFrames: 300, // 10秒
//             x: 50,
//             y: 50,
//             scaleX: 1,
//             scaleY: 1,
//             rotation: 0,
//             opacity: 1,
//         });

//         // 添加一个示例图片剪辑
//         timelineStore.addClipToTrack('track-1', {
//             id: 'image-clip-1',
//             name: 'Sample Image',
//             mediaType: 'image',
//             mediaSourcePath: '/images/sample.jpg', // 请确保你有一个可访问的图片文件在此路径
//             startFrame: 150, // 从第5秒开始
//             durationFrames: 150, // 持续5秒
//             x: 200,
//             y: 100,
//             scaleX: 0.5,
//             scaleY: 0.5,
//             rotation: 45,
//             opacity: 0.8,
//         });
//     }
//     await initEtroMovie();
// });

// onUnmounted(() => {
//     if (movie) {
//         console.log("Destroying etro.Movie instance on unmount.");
//         movie.pause();
//         movie.destroy();
//         movie = null;
//     }
// });
</script>

<style scoped>
.preview-area {
    background-color: #222;
}

.preview-canvas-wrapper {
    background-color: #333;
    position: relative;
    /* 确保 overlay 可以绝对定位在其内部 */
    overflow: hidden;
    flex-grow: 1;
    /* 让画布容器填充可用空间 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview-canvas {
    max-width: 100%;
    max-height: 100%;
    display: block;
}

.preview-controls {
    flex-shrink: 0;
    height: 60px;
}
</style>