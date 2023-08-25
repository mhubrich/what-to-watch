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
        const cardTitle = Card.createElement("h5", "card-title");
        cardTitle.innerHTML = record.movie.name;
        const cardText = Card.createElement("p", "card-text");
        cardText.innerHTML = record.movie.summary;
        const cardButton = Card.createElement("button", "btn btn-primary");
        cardButton.innerHTML = "Remove";
        cardButton.addEventListener("click", () => cb(record.meta.id));
        const cardBody = Card.createElement("div", "card-body", [cardTitle, cardText, cardButton]);
        const colContent = Card.createElement("div", "col-md-8", cardBody);
        const img = Card.createElement("img", "img-fluid rounded-start");
        img.src = record.movie.poster;
        img.alt = record.movie.name;
        const colImg = Card.createElement("div", "col-md-4", img);
        const row = Card.createElement("div", "row g-0", [colImg, colContent]);
        const card = Card.createElement("div", "card mb-3", row);
        const col = Card.createElement("div", "col", card);
        return col;
    }
}

class SearchCard extends Card {
    static createCard(record, cb) {
        const cardTitle = Card.createElement("h5", "card-title");
        cardTitle.innerHTML = record.movie.name;
        const cardButton = Card.createElement("button", "btn btn-primary");
        cardButton.innerHTML = "Add";
        cardButton.addEventListener("click", () => cb(record.movie.id));
        const cardBody = Card.createElement("div", "card-body", [cardTitle, cardButton]);
        const colContent = Card.createElement("div", "col-md-8", cardBody);
        const img = Card.createElement("img", "img-fluid rounded-start");
        img.src = record.movie.poster;
        img.alt = record.movie.name;
        const colImg = Card.createElement("div", "col-md-4", img);
        const row = Card.createElement("div", "row g-0", [colImg, colContent]);
        const card = Card.createElement("div", "card mb-3", row);
        const col = Card.createElement("div", "col", card);
        return col;
    }
}

export {MovieCard, SearchCard};