import Search from './models/Search';


/* Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object 
 * - Liked recipes
*/

const state = {}

const controlSearch = async () => {

    const query = 'pizza'; // TODO

    if(query){
        state.search = new Search(query);

        // prepare UI

        await state.search.getResults();

        // render results
        console.log(state.search.results);
    }

}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});