export const useElementDispatchEventMouseDown = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  var mouseEvent = new MouseEvent("mousedown", {
    view: window,
    bubbles: true,
    cancelable: false,
    clientX: rect.x + rect.width / 2,
    clientY: rect.y + rect.height / 2,
  });

  console.log(mouseEvent);
  el.dispatchEvent(mouseEvent);
};

export const useTriggerDragStart = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  const dragStartEvent = new DragEvent("dragstart", {
    bubbles: true,
    cancelable: true,
    view: window,
    dataTransfer: new DataTransfer(), // 必须提供一个 DataTransfer 对象
    clientX: rect.x + rect.width / 2,
    clientY: rect.y + rect.height / 2,
  }) as any;

  // dragStartEvent.dataTransfer.setData("text/plain", "编程触发的数据");

  el.dispatchEvent(dragStartEvent);
};

export const useElementHaveScroll = (el: HTMLElement) => {
  const hasVerticalScrollbar = el.scrollHeight > el.clientHeight;
  const hasHorizontalScrollbar = el.scrollWidth > el.clientWidth;

  return hasVerticalScrollbar || hasHorizontalScrollbar;
};
