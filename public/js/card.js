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
        const cardBadgeType = Card.createElement("div", "badge");
        cardBadgeType.innerHTML = record.movie.type.name;
        const cardBadgeRating = MovieCard.createStarRating(record.movie.rating);
        const cardBadges = Card.createElement("div", "card-badges", [cardBadgeType, cardBadgeRating]);
        const cardSummary = Card.createElement("p", "card-summary");
        cardSummary.innerHTML = record.movie.summary;
        const cardUser = Card.createElement("p", "card-user");
        const user = record.meta.userId;
        const date = MovieCard.convertDate(record.meta.dateAdded);
        cardUser.innerHTML = `${user} · ${date}`;
        const imdb = Card.createElement("i", "fa-brands fa-imdb");
        const buttonImdb = Card.createElement("a", "button-link", imdb);
        const youtube = Card.createElement("i", "fa-brands fa-youtube");
        const buttonYoutube = Card.createElement("a", "button-link", youtube);
        const pipe = Card.createElement("span", "vertical-bar");
        pipe.innerHTML = "|";
        const remove = Card.createElement("i", "fa-solid fa-trash-can");
        const buttonRemove = Card.createElement("button", "button-remove", remove);
        buttonRemove.addEventListener("click", () => cb(record.meta.id));
        const cardActions = Card.createElement("div", "card-actions", [buttonImdb, buttonYoutube, pipe, buttonRemove]);
        const cardFooter = Card.createElement("div", "card-footer", [cardUser, cardActions]);
        const cardBody = Card.createElement("div", "card-body", [cardTitle, cardBadges, cardSummary, cardFooter]);
        const cardImg = Card.createElement("img", "card-img");
        cardImg.src = record.movie.poster;
        cardImg.alt = record.movie.name;
        const card = Card.createElement("div", "card", [cardImg, cardBody]);
        return card;
    }

    static toNearestHalf(rating) {
        return Math.round(rating * 2) / 2;
    }

    static getStars(rating) {
        const full = Math.floor(rating);
        const half = Math.ceil(rating) - rating;
        const empty = 5 - Math.ceil(half) - full;
        return {
            full: full,
            half: half,
            empty: empty
        }
    }

    static createStarRating(rating) {
        rating = rating / 2;
        rating = MovieCard.toNearestHalf(rating);
        const badges = Card.createElement("div", "badge");
        const stars = MovieCard.getStars(rating);
        for (let i = 0; i < stars.full; i++) {
            badges.appendChild(Card.createElement("span", "fa fa-star"));
        }
        for (let i = 0; i < stars.half; i++) {
            badges.appendChild(Card.createElement("span", "fa fa-star-half-stroke"));
        }
        for (let i = 0; i < stars.empty; i++) {
            badges.appendChild(Card.createElement("span", "fa-regular fa-star"));
        }
        return badges;
    }

    static convertDate(date) {
        return new Date(date).toLocaleDateString("en-us",
            {
                weekday: undefined,
                year: "numeric",
                month: "short",
                day: "numeric"
            });
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