import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js'

@customElement('app-intro')
export class AppIntro extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
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

              #getting-started a {
                border-radius: 6px;
                border: none;
                font-weight: bold;
                height: 2.5em;
                font-size: medium;
                background: #bf89cd;
                color: white;
                display: flex;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                width: 8em;
                text-decoration: none;
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
        `
    ];

    render() {
        return html`
          <section id="getting-started">
            <p>Tap Get Started when your ready to start your camera. You can then begin to save the colors in the world around you!</p>
            <a href="/home">Get Started</a>
          </section>
        <img id="home-image" src="/assets/home.svg" role="presentation">
        `;
    }
}
