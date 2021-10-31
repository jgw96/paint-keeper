import { fileOpen } from 'browser-fs-access';
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '../components/controls';

@customElement('app-camera')
export class Camera extends LitElement {
  @state() stream: MediaStream | undefined;
  @state() imageCapture: any | undefined;
  @state() worker: any | undefined;

  static styles = [
    css`
      :host {
        display: block;
      }

      video {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        object-fit: cover;
        z-index: -1;
      }

      #camera-actions {
        position: fixed;
        bottom: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(24px);
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4em;
      }

      #camera-actions button {
        width: 90%;
        border-radius: 6px;
        border: none;
        font-weight: bold;
        height: 2.5em;
        font-size: medium;

        cursor: pointer;
      }

      #camera-actions button:hover {
        background: darkgrey;
        color: white;
      }

      @media (min-width: 900px) {
        #camera-actions {
          margin: 0;
          padding: 0;
          right: 4px;
          left: initial;
          bottom: 0px;
          background: transparent;
          width: 8em;
        }
      }
    `,
  ];

  firstUpdated() {
    try {
      this.initCamera();

      window.requestIdleCallback(() => {
        this.worker = new Worker(new URL("../color-worker", import.meta.url), {
          type: "module"
        });
        console.log(this.worker);
      }, {
        timeout: 1000
      });
    } catch (err) {
      console.error(`Error getting camera access: ${err}`);
    }
  }

  async initCamera() {
    // get camera from mediaDevices api
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });
    const video = this.shadowRoot?.querySelector('video');

    console.log('video', video);

    if (video) {
      video.srcObject = this.stream;
      video.play();

      const mediaStreamTrack = this.stream.getVideoTracks()[0];
      this.imageCapture = new (window as any).ImageCapture(mediaStreamTrack);
    }
  }

  async saveColor() {
    // take image with imageCapture api
    const bitmap = await this.imageCapture.grabFrame();

    if (this.worker) {
      this.worker.onmessage = (e: any) => {
        const color = e.data;
        console.log(color);

        this.dispatchEvent(
          new CustomEvent('color-saved', {
            detail: { color: [color.r, color.g, color.b], bitmap: bitmap },
          })
        );
      }
      this.worker.postMessage(bitmap);
    }
  }

  async openFromFile() {
    const blob = await fileOpen({
      mimeTypes: ['image/*'],
    });

    const bitmap = await createImageBitmap(blob);
    if (this.worker) {
      this.worker.onmessage = (e: any) => {
        const color = e.data;
        console.log(color);

        this.dispatchEvent(
          new CustomEvent('color-saved', {
            detail: { color: [color.r, color.g, color.b], bitmap: bitmap },
          })
        );
      }
      this.worker.postMessage(bitmap);
    }
  }

  disconnectedCallback() {
    this.worker?.terminate();
  }

  render() {
    return html`
      <app-controls @open-file="${() => this.openFromFile()}"></app-controls>

      <video></video>

      <div id="camera-actions">
        <button @click="${() => this.saveColor()}">Find Color</button>
      </div>
    `;
  }
}
