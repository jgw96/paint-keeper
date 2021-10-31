import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

import '../components/camera';
import '../components/color-display';

@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  @state() colorPicked:
    | { color: Array<number>; bitmap: ImageBitmap }
    | undefined;

  static get styles() {
    return css`
      #saved-colors {
        font-weight: bold;
        text-decoration: none;
        padding: 10px;
        border-radius: 6px;
        color: white;
        position: fixed;
        right: 10px;
        top: 10px;
        background: #181818;
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'PWABuilder pwa-starter',
        text: 'Check out the PWABuilder pwa-starter!',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  handleColor(details: { color: Array<number>; bitmap: ImageBitmap }) {
    console.log('color from event', details);
    this.colorPicked = details;
  }

  render() {
    return html`
      <div>
        <a id="saved-colors" href="/about">My Saved Colors</a>

        <app-camera
          @color-saved="${(event: CustomEvent) =>
            this.handleColor(event.detail)}"
        ></app-camera>
        <color-display .color="${this.colorPicked}"></color-display>
      </div>
    `;
  }
}
