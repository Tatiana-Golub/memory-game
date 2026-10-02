import { createElement } from "./utils/createElement.js";

export const createModal = () => {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';

    const content = createElement('div', 'modal-content');

    dialog.append(content);

    const close = () => {
        dialog.close();
        document.body.classList.remove('modal-open');
    };

    const open = () => {
        dialog.showModal();
        document.body.classList.add('modal-open');
    };

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            close();
        }
    });

    return {
        dialog,
        content,
        open,
        close,
    };
};