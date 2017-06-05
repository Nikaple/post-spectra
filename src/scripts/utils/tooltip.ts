export class Tooltip {

  private delay: number;
  private margin: number;
  private tooltip: HTMLDivElement;
  private static instance: Tooltip;

  constructor(delay = 50, margin = 10) {
    this.delay = delay;
    this.margin = margin;
    this.tooltip = document.createElement('div');
    this.init();
  }

  init() {
    document.addEventListener('mouseover', this.onMouseOver.bind(this));
    document.addEventListener('mouseout', this.onMouseOut.bind(this));
  }

  onMouseOver(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute('data-tooltip')) return;
    this.tooltip.className = 'tooltip';
    this.tooltip.innerHTML = target.getAttribute('data-tooltip') as string;
    document.body.appendChild(this.tooltip);
    this.getPosition(e.target as HTMLElement);
  }

  onMouseOut(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute('data-tooltip')) return;
    document.body.removeChild(this.tooltip);
  }

  getPosition(elem: HTMLElement) {
    const elemPos: ClientRect = elem.getBoundingClientRect();
    this.tooltip.style.left = Math.round(
      elemPos.left + (elem.offsetWidth - this.tooltip.offsetWidth) / 2) + 'px';
    this.tooltip.style.top = Math.round(
      elemPos.top - this.tooltip.offsetHeight - this.margin + pageYOffset) + 'px';
  }

  public static get getInstance(): Tooltip {
    if (!Tooltip.instance) {
      return new Tooltip();
    }
    return Tooltip.instance;
  }
}
