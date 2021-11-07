import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-controls')
export class Controls extends LitElement {
  static styles = [
    css`
      :host {
        display: block;

        position: fixed;
        bottom: 11px;
        right: 8em;
      }

      #control-bar {
        animation-name: slideup;
        animation-duration: 300ms;
      }

      #control-bar button {
        margin-right: 4px;
        border-radius: 6px;
        border: none;
        padding: 8px;

        height: 2.5em;
        font-size: initial;
        padding: 5px;

        cursor: pointer;
      }

      #control-bar button:hover {
        background: darkgrey;
        color: white;
      }

      #control-bar button ion-icon {
        font-size: 2em;
      }

      #folder-icon {
        width: 2em;
      }

      @keyframes slideup {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
    `,
  ];

  openFromFile() {
    this.dispatchEvent(new CustomEvent('open-file'));
  }

  render() {
    return html`
      <div id="control-bar">
        <button @click="${() => this.openFromFile()}">
          <img id="folder-icon" src="assets/icons/folder-outline.svg" />
        </button>
      </div>
    `;
  }
}
