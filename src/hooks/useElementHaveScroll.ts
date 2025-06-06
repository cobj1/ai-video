export const useElementHaveScroll = (el: HTMLElement) => {
  const hasVerticalScrollbar = el.scrollHeight > el.clientHeight;
  const hasHorizontalScrollbar = el.scrollWidth > el.clientWidth;

  return hasVerticalScrollbar || hasHorizontalScrollbar;
};
