import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
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

        // create recipe
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
        } catch (err) {
            console.log(err);
        }
    }
};

// adding to both the events
["hashchange", "load"].forEach((event) => window.addEventListener(event, controlRecipe));
