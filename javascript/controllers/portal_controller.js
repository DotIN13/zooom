import { Controller } from "stimulus";

export default class extends Controller {
  // Portal: teleporting portals for players
  // Player Container: flexbox, contains player, sets player position
  // Player: teleported elements

  static targets = ["template", "image"];

  static values = {
    id: String,
    containerDataset: Object,
    containerClass: String,
  };

  connect() {
    this.idValue =
      "portal-" +
      [...Array(8)].map(() => Math.random().toString(36)[2]).join("");
    this.element.id = this.idValue;
    this.templateTarget.content.querySelector(
      "[data-controller]"
    ).dataset.portalId = this.idValue;
  }

  /* Callbacks */

  // Open a portal
  open(event) {
    const container = this.newContainer();
    this.newPlayer(container, event.params);
  }

  /* Utilities */

  // Create a new portal for the player
  newContainer() {
    const container = document.createElement("div");
    container.className = "portal-player player-outer";
    Object.assign(container.dataset, this.containerDatasetValue);
    return container;
  }

  // Remove portal and its player
  removeContainer(container) {
    container.remove();
  }

  // Create the content for the portal
  newPlayer(container, params) {
    container.innerHTML = this.templateTarget.innerHTML;
    // Custom destination
    const targetNode =
      document.getElementById(params["destinationId"]) || document.body;
    targetNode.appendChild(container);
  }
}
