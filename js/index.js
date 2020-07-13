import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader } from './views/base';


/* Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object 
 * - Liked recipes
*/
const state = {}

const controlSearch = async () => {

    const query = searchView.getInput(); // TODO

    if(query){
        state.search = new Search(query);

        // prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        await state.search.getResults();

        // render results
        searchView.renderResults(state.search.results);
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});