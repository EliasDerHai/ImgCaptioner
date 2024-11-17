import { Component, JSXElement, onCleanup, createEffect, splitProps } from 'solid-js';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';

type TooltipProps = {
  content: string | null;
  asHtml?: boolean;
  children: JSXElement;
};

const CustomTooltip: Component<TooltipProps> = (props) => {
  let ref: HTMLSpanElement | undefined;
  let tooltipInstance: Instance | undefined;

  const [local] = splitProps(props, ['content', 'asHtml', 'children']);

  createEffect(() => {
    const content = local.content;

    if (ref && content) {
      if (tooltipInstance) {
        tooltipInstance.setContent(content);
      } else {
        tooltipInstance = tippy(ref, {
          content: content,
          trigger: 'mouseenter focus',
          animation: 'scale',
          allowHTML: local.asHtml ?? false,
          delay: 0
        });
      }
    } else if (tooltipInstance) {
      tooltipInstance.destroy();
      tooltipInstance = undefined;
    }
  });

  onCleanup(() => {
    if (tooltipInstance) {
      tooltipInstance.destroy();
    }
  });

  // noinspection JSUnusedAssignment
  return <span ref={ref}>{local.children}</span>;
};

export default CustomTooltip;
