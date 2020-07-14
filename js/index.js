import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

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
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            console.log(err);
        }
    }
};

// adding to both the events
["hashchange", "load"].forEach(e => window.addEventListener(e, controlRecipe));