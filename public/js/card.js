/**
 * Card
 *   - Image (left column)
 *   - Body (right column)
 *     - Title
 *     - Badges
 *       - Type, Year, Runtime, Genres, Rating
 *     - Summary
 *     - Footer
 *       - User and date (left column)
 *       - Actions (right column)
 *         - IMDb link, Youtube link, Add/Remove
 *
 * @export
 * @class Card
 */
export default class Card {
    
    static createCard(record, cb) {
        const card = new Card();
        const cardImg = card.cardImg(record.movie.poster);
        const cardBody = card.cardBody(record, cb);
        return card.createElement("div", "card", [cardImg, cardBody]);
    }

    createElement(tagName, className, children) {
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

    /****** Image (left) ******/

    cardImg(url) {
        const img = this.createElement("div", "card-img");
        if(url) img.style.backgroundImage = `url(${url})`;
        return img;
    }

    /****** Body (right) ******/

    cardBody(record, cb) {
        const cardTitle = this.cardTitle(record.movie.name);
        const cardBadges = this.cardBadges(record);
        const cardSummary = this.cardSummary(record.movie.summary);
        const cardFooter = this.cardFooter(record, cb);
        const children = [cardTitle, cardBadges, cardSummary, cardFooter];
        return this.createElement("div", "card-body", children);
    }

    /****** Body > Title ******/

    cardTitle(title) {
        const cardTitle = this.createElement("h1", "card-title");
        cardTitle.innerHTML = title;
        return cardTitle;
    }

    /****** Body > Badges ******/

    cardBadges(record) {
        const badges = []
        if (record && record.movie) {
            if (record.movie.type.name) badges.push(this.cardBadgeType(record.movie.type.name));
            if (record.movie.year) badges.push(this.cardBadgeYear(record.movie.year));
            if (record.movie.runtime) badges.push(this.cardBadgeRuntime(record.movie.runtime));
            if (record.movie.genre) badges.push(this.cardBadgeGenre(record.movie.genre));
            if (record.movie.rating) badges.push(this.cardRating(record.movie.rating));
        }
        return this.createElement("div", "card-badges", badges);
    }

    cardBadgeType(type) {
        const cardBadgeType = this.createElement("div", "badge");
        cardBadgeType.innerHTML = type;
        return cardBadgeType;
    }

    cardBadgeYear(year) {
        const cardBadgeYear = this.createElement("div", "badge");
        cardBadgeYear.innerHTML = year;
        return cardBadgeYear;
    }

    cardBadgeRuntime(runtime) {
        const cardBadgeRuntime = this.createElement("div", "badge");
        cardBadgeRuntime.innerHTML = runtime;
        return cardBadgeRuntime;
    }

    cardBadgeGenre(genre) {
        const cardBadgeGenre = this.createElement("div", "badge");
        cardBadgeGenre.innerHTML = genre.join(" &bull; ");
        return cardBadgeGenre;
    }

    cardRating(rating) {
        rating = rating / 2; // convert from range [0, 10] to [0, 5]
        rating = this.toNearestHalf(rating);
        const badges = this.createElement("div", "badge");
        const stars = this.getNumStars(rating);
        for (let i = 0; i < stars.full; i++) {
            badges.appendChild(this.createElement("span", "fa fa-star"));
        }
        for (let i = 0; i < stars.half; i++) {
            badges.appendChild(this.createElement("span", "fa fa-star-half-stroke"));
        }
        for (let i = 0; i < stars.empty; i++) {
            badges.appendChild(this.createElement("span", "fa-regular fa-star"));
        }
        return badges;
    }

    /****** Body > Summary ******/

    cardSummary(summary) {
        const cardSummary = this.createElement("p", "card-summary");
        if(summary) cardSummary.innerHTML = summary;
        return cardSummary;
    }

    /****** Body > Footer ******/

    cardFooter(record, cb) {
        const cardUser = this.cardUser(record);
        const cardActions = this.cardActions(record, cb);
        return this.createElement("div", "card-footer", [cardUser, cardActions]);
    }

    cardUser(record) {
        const cardUser = this.createElement("p", "card-user");
        if (record && record.meta && record.meta.userId && record.meta.dateAdded) {
            const user = record.meta.userId;
            const date = this.formatDate(record.meta.dateAdded);
            cardUser.innerHTML = `${user} &bull; ${date}`;
        }
        return cardUser;
    }

    /****** Body > Footer > Actions ******/

    cardActions(record, cb) {
        const buttonImdb = this.cardActionImdb(record.movie.imdb);
        const buttonYoutube = this.cardActionYoutube(record.movie.name);
        const pipe = this.cardActionPipe();
        const buttonAction = this.cardActionButton(record, cb);
        const children = [buttonImdb, buttonYoutube, pipe, buttonAction];
        return this.createElement("div", "card-actions", children);
    }

    cardActionImdb(url) {
        const buttonImdb = this.createElement("a", "button-link imdb");
        buttonImdb.innerHTML = "IMDb";
        buttonImdb.target = "_blank";
        buttonImdb.href = url;
        return buttonImdb;
    }

    cardActionYoutube(title) {
        const iconYoutube = this.createElement("i", "fa-brands fa-youtube");
        const buttonYoutube = this.createElement("a", "button-link youtube", iconYoutube);
        buttonYoutube.target = "_blank";
        buttonYoutube.href = `https://www.youtube.com/results?search_query=${title} Trailer`;
        return buttonYoutube;
    }

    cardActionPipe() {
        return this.createElement("div", "pipe");
    }

    cardActionButton(record, cb) {
        const icon = record.meta ? "fa-solid fa-trash-can fa-fw" : "fa-solid fa-plus fa-fw";
        const id = record.meta ? record.meta.id : record.movie.id;
        const buttonIcon = this.createElement("i", icon);
        const button = this.createElement("button", "button-card", buttonIcon);
        button.type = "button";
        button.addEventListener("click", () => cb(id, buttonIcon), { once: true });
        return button;
    }

    /****** Helper functions ******/

    toNearestHalf(rating) {
        return Math.round(rating * 2) / 2;
    }

    getNumStars(rating) {
        const full = Math.floor(rating);
        const half = Math.ceil(rating) - rating;
        const empty = 5 - Math.ceil(half) - full;
        return {
            full: full,
            half: half,
            empty: empty
        }
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString("en-us",
            {
                weekday: undefined,
                year: "numeric",
                month: "short",
                day: "numeric"
            }).replaceAll(" ", "&nbsp;"); // Prevents line break in string
    }
}