import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { deleteColor, getColors } from '../services/colors';

import { styleMap } from 'lit/directives/style-map.js';

@customElement('app-about')
export class AppAbout extends LitElement {
  @state() cards: any[] | undefined;
  @state() deleting: boolean = false;
  @state() colorToDelete: string | undefined;

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
        border-radius: 6px;
        width: 86%;

        height: 12em;
      }

      .color-card button {
        width: 100%;
        border-radius: 6px;
        border: none;
        font-weight: bold;
        height: 2.5em;
        font-size: medium;

        cursor: pointer;
      }

      .color-card button:hover {
        background: darkgrey;
        color: white;
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

      #buttons {
        width: 90%;
      }

      #bottom-bar {
        position: fixed;
        bottom: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(24px);
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

      #bottom-bar a:hover {
        background: darkgrey;
        color: white;
      }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;
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

      #modal-color-display-color {
        font-weight: bold;
        border-radius: 6px;

        padding: 3em;
        font-size: 2em;
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

          z-index: 99;
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

        #modal-color-display-color {
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
      }

      #delete-button {
        background: red;
        margin-top: 8px;
        color: white;
      }

      #actual-delete {
        background: red;
        color: white;
      }

      @media (min-width: 1200px) {
        #color-display {
          inset: 14em 22em 0em 22em;
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

      @media (min-width: 900px) {
        #wrapper {
          margin-top: 4em;
        }

        ul {
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
    await this.updateColors();
  }

  async updateColors() {
    const cards = await getColors();

    if (cards && cards.length > 0) {
      this.cards = cards;
    }
  }

  async copyColor(color: string) {
    // copy color with async clipboard api
    await navigator.clipboard.writeText(color);
  }

  deleteColor(color: string) {
    this.deleting = true;
    this.colorToDelete = color;
  }

  async doDelete(color: string | undefined) {
    console.log(color);

    if (color) {
      await deleteColor(color);
    }

    this.deleting = false;
    this.colorToDelete = undefined;

    await this.updateColors();
  }

  cancel() {
    this.deleting = false;
    this.colorToDelete = undefined;
  }

  render() {
    return html`

        ${this.deleting && this.colorToDelete ? html`<div id="modal-wrapper">
          <div id="color-display">
            <div
              id="modal-color-display-color"
              style="background-color: ${this.colorToDelete || "black"}"
            >
              ${this.colorToDelete}
            </div>

            <div id="buttons">
              <button id="actual-delete" @click="${() => this.doDelete(this.colorToDelete)}">Delete</button>
              <button id="cancel-button" @click="${() => this.cancel()}">
                Cancel
              </button>
            </div>
          </div>
        </div>` : null}

      <div id="wrapper">
        <ul>
        ${this.cards?.map((card) => {
          return html`
            <li class="color-card">
              <div
                id="color-display-color"
                style=${styleMap({ backgroundColor: card.color })}
              ></div>
              <p id="color-string">${card.color}</p>

              <div id="buttons">
                <button @click="${() => this.copyColor(card.color)}">
                  Copy Hex Code
                </button>

                <button id="delete-button" @click="${() => this.deleteColor(card.color)}">
                  Delete Color
                </button>
              </div>
        </li>
          `;
        })}
        </ul>

        <div id="bottom-bar">
          <a href="/">Back</a>
        </div>
      </div>
    `;
  }
}
