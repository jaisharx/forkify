import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

// TEST
window.s = state;

// search
const controlSearch = async () => {
    const query = searchView.getInput(); // TODO
    // const query = 'pizza'; // TODO

    if (query) {
        state.search = new Search(query);

        // prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            await state.search.getResults();

            // render results
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (err) {
            clearLoader();
            console.log(err);
        }
    }
};

elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = +btn.dataset.goto;
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});

// recipe
const controlRecipe = async () => {
    const id = window.location.hash.replace("#", "");

    if (id) {
        // prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected
        if (state.search) searchView.highlightSelected(id);

        // create recipe
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (err) {
            console.log(err);
        }
    }
};

// adding to both the events
["hashchange", "load"].forEach((e) => window.addEventListener(e, controlRecipe));

const controlList = () => {
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });


}

// handle delete and update on list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // handle delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);

        listView.deleteItem(id);
        
        // handle count update 
    }else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        if (val > 0) state.list.updateCount(id, val);
    }
});


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;
    if(!state.likes.isLiked(currentId)){
         const newLike = state.likes.addLike(
             currentId,
             state.recipe.title,
             state.recipe.author,
             state.recipe.img,
         );

         likesView.toggleLikeBtn(true);
         likesView.renderLike(newLike);
        }else {
            state.likes.deleteLike(currentId);
            likesView.toggleLikeBtn(false);
            likesView.deleteLike(currentId) ;
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// restore likes
window.addEventListener('load', () => {
    
    state.likes = new Likes();
    state.likes.readStorage();

    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// recipe btn clicks
elements.recipe.addEventListener("click", (e) => {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches(".btn-increase, .btn-increase *")) {
        // inc btn clicked
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        // add ingredient to shopping list
        controlList();
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
        // like controller
        controlLike();
    }
});