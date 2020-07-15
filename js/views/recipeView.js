import { elements } from './base';
import { Fraction } from '../Fraction';

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
}

const formatCount = count => {
    if (count) {
        const newCount = Math.round(count * 100) / 100;
        const [int, dec] = newCount.toString().split('.').map(el => +el);

        if (!dec) return newCount;

        if (int === 0){
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`;
        }else {
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
};

const createIngredients = ingredient => `
    <li class="recipe__item">
        <i class="far fa-check-circle recipe__icon"></i>
    <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.ingredient}
    </div>
    </li>
`

export const renderRecipe = (recipe, isLiked) => {
    const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
        <div class="recipe__info">
            <i class="fas fa-stopwatch recipe__info-icon"></i>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <i class="fas fa-male recipe__info-icon"></i>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <i class="fas fa-minus"></i>
                </button>
                <button class="btn-tiny btn-increase">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <i class="fa-heart header__likes ${isLiked ? 'fas' : 'far'}"></i>
        </button>
    </div>



    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">

            ${recipe.ingredients.map(el => createIngredients(el)).join('')}

        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <i class="fas fa-shopping-cart search__icon"></i>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <i class="fas fa-caret-right search__icon"></i>

        </a>
    </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
}

export const updateServingsIngredients = recipe => {
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    }) 
}