export function toggleTooltipInMobile(tooltip: any) {
  if (window.innerWidth <= 613) {
    tooltip.toggle();
  }
}

export function stopPropagationInMobile(event: any) {
  if (window.innerWidth <= 613) {
    event.stopImmediatePropagation();
  }
}
