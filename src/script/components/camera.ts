import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '../components/controls';


@customElement('app-camera')
export class Camera extends LitElement {
  @state() stream: MediaStream | string | undefined;
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

        animation-name: slideup;
        animation-duration: 300ms;
      }

      #camera-actions button {
        width: 90%;
        border-radius: 6px;
        border: none;
        font-weight: bold;
        height: 2.5em;
        font-size: medium;

        background: #bf89cd;
        color: white;

        cursor: pointer;
      }

      #camera-actions button:hover {
        background: darkgrey;
        color: white;
      }

      #getting-started {
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-top: 18vh;
        align-items: flex-start;
        margin-left: 14vw;
        width: fit-content;
        height: 85vh;

        animation-name: fadeup;
        animation-duration: 300ms;
      }

      #getting-started button {
        border-radius: 6px;
        border: none;
        font-weight: bold;
        height: 2.5em;
        font-size: medium;
        cursor: pointer;
        padding-left: 1em;
        padding-right: 1em;

        background: #bf89cd;
        color: white;
      }

      #getting-started p {
        max-width: 19em;

        text-align: start;
        font-weight: bold;
        font-size: 2.2em;
      }

      #home-image {
        position: absolute;
        bottom: 12px;
        width: 24em;
        right: 12px;
        opacity: 0.8;

        animation-name: fadeup;
        animation-delay: 500ms;
        animation-duration: 300ms;
      }

      @media (max-width: 900px) {
        #getting-started {
          margin-top: 6em;
          margin-left: 6vw;
          margin-right: 4vw;
        }

        #home-image {
          width: 16em;
        }
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

      @keyframes slideup {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      @keyframes fadeup {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    `,
  ];

  async firstUpdated() {
    try {
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
    const module = await import("browser-fs-access");

    const blob = await module.fileOpen({
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
     ${this.stream ? html`<app-controls @open-file="${() => this.openFromFile()}"></app-controls>` : null}

      <video></video>

      ${
        !this.stream ? html`
          <section id="getting-started">
            <p>Tap Get Started when your ready to start your video. You can then begin to save the colors in the world around you!</p>
            <button @click="${() => this.initCamera()}">Get Started</button>
          </section>
        ` : null
      }

      ${
        !this.stream ? html`<img id="home-image" src="/assets/home.svg" role="presentation">` : null
      }


      ${this.stream ? html`<div id="camera-actions">
        <button @click="${() => this.saveColor()}">Find Color</button>
      </div>` : null}
    `;
  }
}
