/**
 * 推拽精灵
 * 推拽资源时显示资源略缩图，进入时间轴变为长度
 */
import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 精灵属性配置
 */
const wizardConfig = {
  width: 200,
  height: 120,
  padding: 12,
};

/**
 * 携带数据
 */
const data = ref();
/**
 * TargetEvent
 */
const target = ref();

/**
 * 拖拽精灵 El
 */
let draggableWizardRef = ref();

/**
 * 推拽精灵背景 El
 */
let draggableWizardShadeRef = ref();

const setDraggableWizardRef = (ref: any) => (draggableWizardRef = ref);
const setDraggableWizardShadeRef = (ref: any) =>
  (draggableWizardShadeRef = ref);

/**
 * 当用户开始拖拽元素时触发。在这里设置拖拽数据
 */
const onDragstart = (event: any, eventData: any) => {
  event.preventDefault();

  data.value = eventData;

  target.value = event;
};

/**
 * 拖拽过程中持续触发。
 */
const onDrag = (event: any) => {
  if (draggableWizardRef.value) {
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    draggableWizardRef.value.style.left =
      mouseX - (wizardConfig.width + wizardConfig.padding) / 2 + "px";
    draggableWizardRef.value.style.top =
      mouseY - (wizardConfig.height + wizardConfig.padding) / 2 + "px";
  }
};

/**
 * 拖拽结束时触发 (无论是拖拽成功还是取消)。
 */
const onDragend = (event: any) => {
  target.value = null;

  data.value = null;
};

/**
 * 当拖拽元素进入有效的放置目标时触发。
 */
const onDragenter = (event: any) => {
  console.log(event)
};

/**
 * 当拖拽元素在有效的放置目标上移动时持续触发。重要： 默认情况下，浏览器会阻止 drop 事件，所以你需要在 dragover 事件中调用 event.preventDefault() 来允许放置。
 */
const onDragover = (event: any) => {};

/**
 * 当拖拽元素离开有效的放置目标时触发。
 */
const onDragleave = (event: any) => {};

/**
 * 当拖拽元素在放置目标上释放时触发。你可以在这里获取拖拽数据 (event.dataTransfer.getData()) 并执行放置操作。
 */
const onDrop = (event: any) => {};

export const useDraggableWizardStore = defineStore("draggable-wizard", () => {
  return {
    wizardConfig,
    data,
    target,
    setDraggableWizardRef,
    setDraggableWizardShadeRef,
    onDragstart,
    onDrag,
    onDragend,
    onDragenter,
    onDragover,
    onDragleave,
    onDrop,
  };
});
