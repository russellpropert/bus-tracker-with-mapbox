class errorMessage extends HTMLElement {
  #errorMessageContainerElement;
  #errorMessageHeadingElement;
  #errorMessageBodyElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          z-index: 2;
        }

        * {
          margin: 0;
          padding: 0;
        }

        #error-message {
          max-width: min(60rem, 60vw);
          display: none;
          grid-template-columns: 1fr;
          justify-items: center;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 3rem;
          border: black solid 1px;
          background-color: white;
          border-radius: .5rem;
        }

        #error-message.visible {
          display: grid;
        }

        #error-message-heading {
          text-align: center;
          color: red;
          font-size: 1.2rem;
        }

        #error-message-body {
          text-align: center;
          color: black;
          font-size: 1rem;
        }
      </style>

      <div id="error-message">
        <h1 id="error-message-heading"></h1>
        <p id ="error-message-body"></p>
      </div>
    `;

    this.#errorMessageContainerElement = this.shadowRoot.querySelector('#error-message');
    this.#errorMessageHeadingElement = this.shadowRoot.querySelector('#error-message-heading');
    this.#errorMessageBodyElement = this.shadowRoot.querySelector('#error-message-body');
  }

  displayErrorMessage = (errorMessageHeading, errorMessageBody) => {
    if (!this.#errorMessageContainerElement.classList.contains('visible')) this.#errorMessageContainerElement.classList.add('visible');
    if (this.#errorMessageHeadingElement.innerText !== errorMessageHeading) this.#errorMessageHeadingElement.innerText = errorMessageHeading;
    if (this.#errorMessageBodyElement.innerText !== errorMessageBody) this.#errorMessageBodyElement.innerText = errorMessageBody;

    console.error(errorMessageBody);
  };

  hideAndResetErrorMessage = () => {
  if (this.#errorMessageContainerElement.classList.contains('visible')) {
    this.#errorMessageContainerElement.classList.remove('visible');
    this.#errorMessageHeadingElement.innerText = '';
    this.#errorMessageBodyElement.innerText = '';
  }
};
}

customElements.define('error-message', errorMessage);