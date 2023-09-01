class Card {
    constructor() {
        if (this.constructor == Card) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    static createCard(record, cb) {
        throw new Error("Method 'createCard()' must be implemented.");
    }

    static createElement(tagName, className, children) {
        const elem = document.createElement(tagName);
        elem.className = className;
    
        if (children) {
            if (children instanceof Element) {
                children = [children];
            }
            for (const child of children) {
                elem.appendChild(child);
            }
        }
    
        return elem;
    }
}

class MovieCard extends Card {
    static createCard(record, cb) {
        const cardTitle = Card.createElement("h1", "card-title");
        cardTitle.innerHTML = record.movie.name;
        const cardSummary = Card.createElement("p", "card-summary");
        cardSummary.innerHTML = record.movie.summary;
        const cardButton = Card.createElement("button", "card-btn-remove");
        cardButton.innerHTML = "Remove";
        cardButton.addEventListener("click", () => cb(record.meta.id));
        const cardBody = Card.createElement("div", "card-body", [cardTitle, cardSummary, cardButton]);
        const cardImg = Card.createElement("img", "card-img");
        cardImg.src = record.movie.poster;
        cardImg.alt = record.movie.name;
        const card = Card.createElement("div", "card", [cardImg, cardBody]);
        return card;
    }
}

class SearchCard extends Card {
    static createCard(record, cb) {
        const cardTitle = Card.createElement("h1", "card-title");
        cardTitle.innerHTML = record.movie.name;
        const cardButton = Card.createElement("button", "card-btn-add");
        cardButton.innerHTML = "Add";
        cardButton.addEventListener("click", () => cb(record.movie.id));
        const cardBody = Card.createElement("div", "card-body", [cardTitle, cardButton]);
        const cardImg = Card.createElement("img", "card-img");
        cardImg.src = record.movie.poster;
        cardImg.alt = record.movie.name;
        const card = Card.createElement("div", "card", [cardImg, cardBody]);
        return card;
    }
}

export {MovieCard, SearchCard};