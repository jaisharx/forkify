import axios from "axios";
import "regenerator-runtime/runtime";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {

            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.results = res.data.recipes;

            // console.log(this.results);
        } catch (error) {
            console.error(error);
        }
    }

    
}
