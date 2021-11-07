import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('getting-started')
export class GettingStarted extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 98%;

                margin-top: 2em;

                flex-direction: column;
            }

            .first-info-block {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                margin: 10px 10px 10px;
                width: 66vw;
                background: rgba(49, 57, 74, 0.69);
                backdrop-filter: blur(10px);
                border-radius: 6px;
                padding: 2em;

                animation-name: fadeup;
                animation-duration: 300ms;
            }

            .first-info-block img {
                height: 18em;
            }

            .first-info-block p {
                max-width: 22em;
                margin-left: 1em;

                font-weight: bold;
            }

            @keyframes fadeup {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `
    ];

    render() {
        return html`
          <section class="first-info-block">
              <img src="/assets/screenshots/screen3.png" role="presentation">
              <p>Save the colors in the world around you! See a beautiful green color in nature and wish you could use that color later in your art? Just tap Save Color!</p>
          </section>

          <section class="first-info-block">
              <img src="/assets/screenshots/screen2.png" role="presentation">
              <p>See all your saved colors in one place!</p>
          </section>
        `;
    }
}
