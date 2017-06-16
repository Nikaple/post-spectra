import { forEach, round, min } from 'lodash';

export class Tooltip {

  private delay: number;
  private margin: number;
  private tooltip: HTMLDivElement;
  private static instance: Tooltip;

  private constructor(margin = 0) {
    this.margin = margin;
    this.tooltip = document.createElement('div');
    this.init();
  }

  private init() {
    document.addEventListener('mouseover', this.onMouseOver.bind(this));
    document.addEventListener('mouseout', this.onMouseOut.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onMouseOver(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute('data-tooltip')) {
      return;
    }
    this.tooltip.className = 'tooltip';
    this.tooltip.innerHTML = target.getAttribute('data-tooltip') as string;
    document.body.appendChild(this.tooltip);
  }

  private onMouseOut(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute('data-tooltip')) {
      return;
    }
    document.body.removeChild(this.tooltip);
  }

  private onMouseMove(e: MouseEvent): void {
    this.getPosition(e);
  }

  private getPosition(e: MouseEvent) {
    const elem = e.target as HTMLElement;
    if (!elem.hasAttribute) {
      return;
    }
    if (!elem.hasAttribute('data-tooltip')) {
      return;
    }
    const $output = document.querySelector('.output-container') as HTMLDivElement;
    const lineHeight = parseInt(getComputedStyle(elem).lineHeight as string, 10);
    const elemPos: ClientRect = elem.getBoundingClientRect();
    const leftMax = document.body.clientWidth - this.tooltip.offsetWidth;
    this.tooltip.style.left = Math.min(
      round(e.clientX - this.tooltip.offsetWidth / 2), leftMax) + 'px';
    // hack the top pos for 8px
    const temp = 8 + $output.scrollTop % lineHeight;
    this.tooltip.style.top = (Math.floor((e.clientY + temp) / lineHeight) * lineHeight
     - this.tooltip.offsetHeight - this.margin - temp) + 'px';
  }

  public destroy(): void {
    const tooltips = document.querySelectorAll('.tooltip');
    forEach(tooltips, (tooltip) => {
      document.body.removeChild(tooltip);
    });
  }

  public static get getInstance(): Tooltip {
    if (!Tooltip.instance) {
      Tooltip.instance = new Tooltip();
    }
    return Tooltip.instance;
  }
}
