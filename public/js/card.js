class Card {
    constructor() {
        if (this.constructor == Card) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    static createCard(record) {
        throw new Error("Method 'createCard()' must be implemented.");
    }
}

class MovieCard extends Card {
    static createCard(record) {
        // todo
    }
}

class SearchCard extends Card {
    static createCard(record) {
        // todo
    }
}

export {MovieCard, SearchCard};