import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getColors } from '../services/colors';

import { styleMap } from 'lit/directives/style-map.js';

@customElement('app-about')
export class AppAbout extends LitElement {

  @state() cards: any[] | undefined;

  static get styles() {
    return css`
      .color-card {
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        display: flex;
        background: black;
        width: 100%;
        padding-top: 1em;

        margin: 10px;
        width: initial;
        padding-bottom: 1em;
        border-radius: 6px;

        animation-name: slideup;
        animation-duration: 0.3s;
      }

      #color-display-color {
          border-radius: 50%;
          width: 6em;
          height: 6em;
          background-color: #3f373a;
      }

      .color-card button {
          width: 100%;
          border-radius: 6px;
          border: none;
          font-weight: bold;
          height: 2.5em;
          font-size: medium;
      }

      .color-card #cancel-button {
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

      #preview-canvas {
          border-radius: 6px;
      }

      #buttons {
          width: 90%;
      }

      #bottom-bar {
        position: fixed;
        bottom: 0;
        background: #181818;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: start;
        height: 4em;

        padding-left: 10px;
        padding-right: 10px;
      }

      #bottom-bar a {
        font-weight: bold;
        text-decoration: none;
        justify-content: center;
        display: flex;
        align-items: center;
        height: 2.8em;
        border-radius: 6px;
        width: 4em;
        color: black;
        background: #efefef;
      }

      @media (min-width: 900px) {
        #wrapper {
          margin-top: 5em;
          display: grid;
          grid-template-columns: auto auto auto auto;
        }

        #bottom-bar {
          top: 0;
          bottom: unset;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const cards = await getColors();

    if (cards && cards.length > 0) {
      this.cards = cards;
    }
  }

  async copyColor(color: string) {
    // copy color with async clipboard api
    await navigator.clipboard.writeText(color);
  }

  render() {
    return html`
      <div id="wrapper">
        ${
          this.cards?.map((card) => {
            return html`
            <div class="color-card">
                <div id="color-display-color" style=${styleMap({ backgroundColor: card.color })}></div>
                <p id="color-string">${card.color}</p>

                <div id="buttons">
                  <button @click="${() => this.copyColor(card.color)}">Copy Hex Code</button>
                </div>
            </div>
            `
          })
        }

        <div id="bottom-bar">
          <a href="/">Back</a>
        </div>
      </div>
    `;
  }
}
