import { ref, watchEffect } from "vue";
import { FFmpeg, type LogEvent } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

interface UseVideoFrameOptions {
  log?: boolean;
}

const ffmpeg = ref<FFmpeg | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const frameUrl = ref<string | null>(null); // 存储提取的帧的URL

const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";

// 初始化 FFmpeg
const loadFFmpeg = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const ffm = new FFmpeg();
    // 设置日志输出
    ffm.on("log", ({ message }: LogEvent) => console.log(message));

    // FFmpeg 核心文件的路径。在生产环境中，你可能需要将其托管在 CDN 或服务器上
    // 这里的路径是 @ffmpeg/ffmpeg 的默认 CDN 地址，也可以是本地路径
    await ffm.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    ffmpeg.value = ffm;
    isLoading.value = false;
  } catch (e: any) {
    console.error("Failed to load FFmpeg:", e);
    error.value = `Failed to load FFmpeg: ${e.message}`;
    isLoading.value = false;
  }
};

export function useVideoFrame() {
  // 提取视频某一帧
  const extractFrame = async (
    videoFile: File,
    timeInSeconds: number, // 提取帧的时间点，单位秒
    outputWidth: number = 300 // 输出图片的宽度
  ): Promise<string | null> => {
    if (!ffmpeg.value) {
      error.value = "FFmpeg is not loaded.";
      return null;
    }
    if (!videoFile) {
      error.value = "No video file provided.";
      return null;
    }

    try {
      isLoading.value = true;
      error.value = null;
      frameUrl.value = null;

      const inputFileName = videoFile.name;
      const outputFileName = "output_frame.png";

      // 将文件写入 FFmpeg 内存文件系统
      await ffmpeg.value.writeFile(inputFileName, await fetchFile(videoFile));

      // 运行 FFmpeg 命令提取帧
      // -ss: 从指定时间开始处理
      // -i: 输入文件
      // -frames:v 1: 只提取一帧视频
      // -vf scale=width:-1: 缩放视频，-1表示根据比例自动计算高度
      await ffmpeg.value.exec([
        "-ss",
        timeInSeconds.toString(),
        "-i",
        inputFileName,
        "-frames:v",
        "1",
        "-vf",
        `scale=${outputWidth}:-1`,
        outputFileName,
      ]);

      // 从 FFmpeg 内存文件系统读取输出文件
      const data = await ffmpeg.value.readFile(outputFileName);

      // 创建 Blob 并生成 URL
      const blob = new Blob([data], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      frameUrl.value = url;
      return url;
    } catch (e: any) {
      console.error("Failed to extract frame:", e);
      error.value = `Failed to extract frame: ${e.message}`;
      return null;
    } finally {
      isLoading.value = false;
      // 清理 FFmpeg 内存文件系统中的文件 (可选，但在处理大量文件时推荐)
      // await ffmpeg.value.rm(inputFileName);
      // await ffmpeg.value.rm(outputFileName);
    }
  };

  // 在组件挂载时加载 FFmpeg
  watchEffect(() => {
    if (!ffmpeg.value && !isLoading.value) {
      loadFFmpeg();
    }
  });

  // 暴露给组件使用的值和方法
  return {
    ffmpeg,
    isLoading,
    error,
    frameUrl,
    loadFFmpeg,
    extractFrame,
  };
}
