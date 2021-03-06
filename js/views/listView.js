import { elements } from "./base";

export const renderItem = (item) => {

    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value" min="0">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredients}</p>
            <button class="shopping__delete btn-tiny">
                <i class="far fa-times-circle"></i>
            </button>
        </li>
    `;

    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = (id) => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
};
