import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js'
import { saveColor } from '../services/colors';
import { rgbToHex } from '../utils';

@customElement('color-display')
export class ColorDisplay extends LitElement {
    @property() color: { color: Array<number>, bitmap: ImageBitmap } | undefined;

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
                background: black;
                width: 100%;
                height: 26em;
                position: fixed;
                bottom: 0px;
                z-index: 99;
                padding-top: 1em;

                border-radius: 8px 8px 0px 0px;

                animation-name: slideup;
                animation-duration: 0.3s;
            }

            #color-display-color {
                border-radius: 50%;
                width: 6em;
                height: 6em;
                background-color: #3f373a;
            }

            #color-display button {
                width: 100%;
                border-radius: 6px;
                border: none;
                font-weight: bold;
                height: 2.5em;
                font-size: medium;
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

            #preview-canvas {
                border-radius: 6px;
            }

            #buttons {
                width: 90%;
            }

            @media(min-width: 900px) {
                #color-display {
                    left: 15vw;
                    right: 15vw;
                    width: initial;
                    bottom: 15vw;
                    top: 15vw;
                    border-radius: 6px;
                    padding-bottom: 1em;

                    backdrop-filter: blur(22px);
                    background: #000000a8;

                    animation-name: slideupdesktop;
                    animation-duration: 0.3s;
                }

                #buttons {
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-top: 5em;
                    width: 95%;
                }

                #buttons button, #color-display #cancel-button {
                    margin-left: 10px;
                    margin-top: 0;
                    width: 8em;
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
        `
    ];

    updated(changedProperties: any) {
        if (changedProperties.has('color')) {
            if (this.color) {
                console.log('this.color', this.color);

                this.colorHexString = rgbToHex(this.color.color[0], this.color.color[1], this.color.color[2])

                const canvas = this.shadowRoot?.querySelector('#preview-canvas') as HTMLCanvasElement;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(this.color.bitmap, 0, 0);
            }
        }
      }

    saveTheColor() {
        if (this.color) {
            saveColor(this.color);

            this.color = undefined;
        }
    }

    cancel() {
        this.color = undefined;
    }

    render() {
        if (this.color) {
            return html`
            <div id="color-display">
                <div id="color-display-color" style="background-color: ${this.colorHexString}"></div>
                <span id="color-string">${this.colorHexString}</span>

                <canvas id="preview-canvas"></canvas>

                <div id="buttons">
                  <button @click="${() => this.saveTheColor()}">Save Color</button>
                  <button id="cancel-button" @click="${() => this.cancel()}">Cancel</button>
                </div>
            </div>
            `;
        }
        else {
            return html``;
        }
    }
}
