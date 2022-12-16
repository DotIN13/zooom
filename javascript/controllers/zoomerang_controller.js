import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["placeholder", "image"];

  static outlets = ["portal"];

  initialize() {
    this.element.dataset.zoomerangPortalOutlet = `#${this.element.dataset.portalId}`;
    this.portalRect = this.portalOutlet.imageTarget.getBoundingClientRect();
  }

  zoomIn() {
    this.imageRect = this.imageTarget.getBoundingClientRect();
    const zoomIn = [{ transform: this.newTransform() }, { transform: "none" }];
    const zoomInTiming = {
      duration: 400,
      iterations: 1,
      fill: "forwards",
      easing: "cubic-bezier(0.4, 0, 0, 1)",
    };
    this.animation = this.imageTarget.animate(zoomIn, zoomInTiming); // Start animation
    this.imageTarget.style.visibility = "visible"; // Then set the image to visible
  }

  zoomOut() {
    if (this.animation.playState == "running") {
      this.animation.commitStyles();
      this.animation.cancel();
    }

    // The imageRect should not be updated
    this.portalRect = this.portalOutlet.imageTarget.getBoundingClientRect();

    const zoomOut = [
      { transform: this.imageTarget.style.transform || "none" },
      { transform: this.newTransform() },
    ];
    const zoomOutTiming = {
      duration: 400,
      iterations: 1,
      fill: "forwards",
      easing: "cubic-bezier(0.4, 0, 0, 1)",
    };
    this.imageTarget
      .animate(zoomOut, zoomOutTiming)
      .finished.then(() =>
        this.portalOutlet.removeContainer(this.element.parentElement)
      );
  }

  newTransform() {
    const end = this.portalRect; // Transform to
    const start = this.imageRect; // Transform from

    const scaleX = end.width / start.width;
    const scaleY = end.height / start.height;
    const translateX = end.left - start.left + (end.width - start.width) / 2;
    const translateY = end.top - start.top + (end.height - start.height) / 2;
    return `translate(${translateX}px, ${translateY}px) scaleX(${scaleX}) scaleY(${scaleY})`;
  }
}
