import { createElement } from "./createElement.js";

export const createButton = (text, className, ariaLabel) => {
    const button = createElement('button', className, text);
    button.type = 'button';
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    return button;
};