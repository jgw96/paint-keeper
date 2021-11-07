import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { saveColor } from '../services/colors';
import { rgbToHex } from '../utils';

@customElement('color-display')
export class ColorDisplay extends LitElement {
  @property() color: { color: Array<number>; bitmap: ImageBitmap } | undefined;

  @state() colorHexString: string | undefined;

  static styles = [
    css`
      :host {
        display: block;
      }

      #color-display {
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        display: flex;
        width: 100%;
        height: 26em;
        position: fixed;
        bottom: 0px;
        z-index: 99;
        padding-top: 1em;

        border-radius: 8px 8px 0px 0px;

        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(24px);

        animation-name: slideup;
        animation-duration: 0.3s;
      }

      #color-display-color {
        font-weight: bold;
        border-radius: 6px;

        padding: 3em;
        font-size: 2em;

        padding: 6em;
      }

      #color-display button {
        width: 100%;
        border-radius: 6px;
        border: none;
        font-weight: bold;
        height: 2.5em;
        font-size: medium;

        cursor: pointer;
      }

      #color-display button:hover {
        background: darkgrey;
        color: white;
      }

      #color-display #cancel-button {
        width: 100%;
        border-radius: 6px;
        border: none;
        font-weight: bold;
        height: 2.5em;
        font-size: medium;
        background: red;
        color: white;

        margin-top: 8px;
      }

      #color-string {
        font-weight: bold;
      }

      #buttons {
        width: 90%;
      }

      @media (min-width: 900px) {
        #modal-wrapper {
          backdrop-filter: blur(24px);
          align-items: center;
          justify-content: center;
          display: flex;
          background: #00000073;
          right: 0;
          bottom: 0;
          left: 0;
          top: 0;
          position: fixed;
          top: 99999;
        }

        #color-display {
          background: black;
          padding: 16px;
          border-radius: 6px;

          position: initial;
          width: initial;
          height: initial;

          justify-content: center;
          align-items: center;
          display: flex;

          animation-name: slideupdesktop;
          animation-duration: 0.3s;
        }

        #color-display-color {
          padding: 4em;
          font-size: 2em;
        }

        #buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 5em;
          width: 95%;
        }

        #buttons button,
        #color-display #cancel-button {
          margin-left: 10px;
          margin-top: 0;
          width: 8em;
        }

        #save-button, #share-button {
          background: #bf89cd;
          color: white;
        }

        #color-display {
          inset: 14em 22em 0em 22em;

          height: auto;
          padding-top: 2em;
          padding-left: 2em;
          padding-right: 2em;
          width: initial;
        }

        #color-display-color {
          width: 18em;
          text-align: center;

          height: 5em;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #color-display #buttons {
          justify-content: space-between;
          width: 100%;
        }

        #positive-actions #share-button {
          background: #637187;
        }
      }

      @media (screen-spanning: single-fold-vertical) {
        #modal-wrapper {
          right: 0px;
          left: env(fold-left);
          width: 52%;
        }
      }

      @keyframes slideupdesktop {
        0% {
          transform: translateY(20%);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: initial;
        }
      }

      @keyframes slideup {
        0% {
          transform: translateY(100%);
        }
        100% {
          transform: translateY(0);
        }
      }
    `,
  ];

  updated(changedProperties: any) {
    if (changedProperties.has('color')) {
      if (this.color) {
        console.log('this.color', this.color);

        this.colorHexString = rgbToHex(
          this.color.color[0],
          this.color.color[1],
          this.color.color[2]
        );
      }
    }
  }

  saveTheColor() {
    if (this.color) {
      saveColor(this.color);

      this.color = undefined;
    }
  }

  async shareTheColor() {
    if (this.color) {

      try {
        // share the color with the web share api
        await navigator.share({
          title: 'Color',
          text: this.color.toString(),
          url: location.href
        });
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  cancel() {
    this.color = undefined;
  }

  render() {
    if (this.color) {
      return html`
        <div id="modal-wrapper">
          <div id="color-display">
            <div
              id="color-display-color"
              style="background-color: ${this.colorHexString}"
            >
              ${this.colorHexString}
            </div>

            <div id="buttons">
              <button id="cancel-button" @click="${() => this.cancel()}">
                Cancel
              </button>

              <div id="positive-actions">
                <button id="share-button" @click="${() => this.shareTheColor()}">Share Color</button>
                <button id="save-button" @click="${() => this.saveTheColor()}">Save Color</button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return null;
    }
  }
}
