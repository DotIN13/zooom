import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["image"];
  static outlets = ["portal"];

  initialize() {
    this.element.dataset.zooomPortalOutlet = `#${this.element.dataset.portalId}`;
    this.portalImage = this.portalOutlet.imageTarget;
    this.portalRect = this.portalImage.getBoundingClientRect();
  }

  zoomIn() {
    this.imageRect = this.imageTarget.getBoundingClientRect();
    const style = this.imageTarget.style;
    let transition = null,
      transform = this.newTransform(this.imageRect, this.portalRect);
    this.commitStyles(style, { transition, transform });

    window.requestAnimationFrame(() => {
      let visibility = "visible";
      transition = "transform 400ms cubic-bezier(0.4, 0, 0, 1)";
      transform = null;
      this.commitStyles(style, { visibility, transition, transform });
    });
  }

  // Set the image to fixed, and place it in its current position.
  // Then set transform for the image to zoom it out into its portal position.
  // In the process, check if the portal moved in every frame,
  // also move the player when necessary.
  zoomOut() {
    if (this.zoomingOut) return;

    this.zoomingOut = true;

    const style = this.imageTarget.style;
    this.imageRect = this.imageTarget.getBoundingClientRect();

    let { top, left, width, height } = this.imageRect;
    const pos = { top, left, width, height };
    let position = "fixed",
      transition = "none",
      transform = "none";
    this.commitStyles(style, { ...pos, position, transition, transform });

    this.imageTarget.addEventListener("transitionend", (e) => {
      if (e.propertyName != "transform") return;

      this.zoomingOut = false;
      this.portalOutlet.removeContainer(this.element.closest(".portal-player"));
    });

    window.requestAnimationFrame(() => {
      transition = "transform 400ms cubic-bezier(0.4, 0, 0, 1)";
      transform = this.newTransform(this.imageRect, this.portalRect);
      this.updateTopLeft();
      this.commitStyles(style, { transition, transform });
    });
  }

  updateTopLeft() {
    if (!this.zoomingOut) return;

    const newPortalRect = this.portalImage.getBoundingClientRect();

    let { top, left } = this.imageRect;
    const topDiff = newPortalRect.top - this.portalRect.top;
    const leftDiff = newPortalRect.left - this.portalRect.left;

    const style = this.imageTarget.style;
    if (topDiff != 0 || leftDiff != 0)
      this.commitStyles(style, { top: top + topDiff, left: left + leftDiff });
    window.requestAnimationFrame(this.updateTopLeft.bind(this));
  }

  // Calculate transform properties from origin and target locations
  newTransform(start, end) {
    const scaleX = end.width / start.width;
    const scaleY = end.height / start.height;
    const translateX = end.left - start.left + (end.width - start.width) / 2;
    const translateY = end.top - start.top + (end.height - start.height) / 2;
    return `translate(${translateX}px, ${translateY}px) scaleX(${scaleX}) scaleY(${scaleY})`;
  }

  // Assign styles to the element at once,
  // add missing "px" to positioning properties
  commitStyles(elStyle, styles) {
    Object.keys(styles).forEach((key) => {
      if (["top", "left", "bottom", "right", "height", "width"].includes(key))
        styles[key] = `${styles[key]}px`;
    });
    Object.assign(elStyle, styles);
  }
}
