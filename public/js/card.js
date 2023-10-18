import lazyLoadingObserver from "./lazy-loading-observer.js";


/**
 * Card
 *   - Image (left column)
 *   - Body (right column)
 *     - Title
 *     - Badges
 *       - Type, Year, Runtime, Rating, Genres, Streaming
 *     - Streaming providers
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

    static ACTION_ADD = "ADD";
    static ACTION_DELETE = "DELETE";
    static ACTION_STREAMING = "STREAMING";

    constructor(record, cb) {
        this.record = record;
        this.cb = cb;
        this.movieId = record.movie.id;
        this.movieType = record.movie.type.name;
        this.metaId = record.meta ? record.meta.id : null;
        this.card = this.createCard();
    }
    
    createCard() {
        const cardImg = this.cardImg();
        const cardBody = this.cardBody();
        return this.createElement("div", "card", [cardImg, cardBody]);
    }

    /****** Image (left) ******/

    cardImg() {
        // Request smaller image based on window size
        // Our assumption is that a card is never larger than its window width/height
        const img_width = Math.ceil(window.innerWidth);
        const img_height = Math.ceil(window.innerHeight);
        // TODO Ideally, move this to the API side
        const url = this.record.movie.poster;
        const img_url = url.replace("@._V1_.", `@._V1_SX${img_width}_SY${img_height}_.`);
        const img = this.createElement("div", "card-img");
        // Image is lazy loaded when in close proximity to viewport
        img.dataset.src = img_url;
        lazyLoadingObserver.observe(img);
        return img;
    }

    /****** Body (right) ******/

    cardBody() {
        const cardTitle = this.cardTitle();
        const cardBadges = this.cardBadges();
        const cardStreaming = this.createStreaming();
        const cardSummary = this.cardSummary();
        const cardFooter = this.cardFooter();
        const children = [cardTitle, cardBadges, cardStreaming, cardSummary, cardFooter];
        return this.createElement("div", "card-body", children);
    }

    /****** Body > Title ******/

    cardTitle() {
        const cardTitle = this.createElement("h1", "card-title");
        cardTitle.innerHTML = this.record.movie.name;
        return cardTitle;
    }

    /****** Body > Badges ******/

    cardBadges() {
        const badges = []
        if (this.record.movie.type.name) badges.push(this.cardBadgeType(this.record.movie.type.name));
        if (this.record.movie.year) badges.push(this.cardBadgeYear(this.record.movie.year));
        if (this.record.movie.runtime) badges.push(this.cardBadgeRuntime(this.record.movie.runtime));
        if (this.record.movie.rating) badges.push(this.cardBadgeRating(this.record.movie.rating));
        if (this.record.movie.genre) badges.push(this.cardBadgeGenre(this.record.movie.genre));
        badges.push(this.cardBadgeStreaming());
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

    cardBadgeGenre(genres) {
        genres = genres.slice(0, 2); // limit to first two genres
        genres.forEach((genre, i) => { // shorten long genre names
            if (genre === "Biography") genres[i] = "Bio";
            if (genre === "Documentary") genres[i] = "Docu";
        });
        const cardBadgeGenre = this.createElement("div", "badge");
        cardBadgeGenre.innerHTML = genres.join(" &bull; "); // seperate by bullet point
        return cardBadgeGenre;
    }

    cardBadgeRating(rating) {
        const badgeIcon = this.createElement("span", "fa fa-star");
        const badgeLabel = this.createElement("span", "badge-label");
        badgeLabel.textContent = `\xa0${rating}`;  // adds whitespace at the beginning
        return  this.createElement("div", "badge", [badgeIcon, badgeLabel]);
    }

    cardBadgeStreaming() {
        // Create label
        const badgeLabel = this.createElement("span", "badge-label");
        badgeLabel.textContent = `Streaming\xa0`; // adds whitespace at the end
        // Create icon
        this.badgeStreamingIcon = this.createElement("span");
        this.setBadgeStreamingIcon();
        // Create badge
        const children = [badgeLabel, this.badgeStreamingIcon];
        this.badgeStreaming = this.createElement("div", "badge collapsible", children);
        this.badgeStreaming.addEventListener("click", () => this.cb(Card.ACTION_STREAMING, this));
        return this.badgeStreaming;
    }

    setBadgeStreamingIcon() {
        this.setClass(this.badgeStreamingIcon, "fa-solid fa-chevron-down fa-fw badge-icon");
    }

    setBadgeStreamingSpinner() {
        this.setClass(this.badgeStreamingIcon, "fas fa-spinner fa-spin fa-fw");
    }

    /****** Body > Streaming Providers ******/

    isStreamingEmpty() {
        return this.streamingProviders.childElementCount == 0
    }

    isStreamingActive() {
        return this.steamingContainer.classList.contains("active");
    }

    openStreaming() {
        this.badgeStreamingIcon.classList.add("active");
        this.steamingContainer.classList.add("active");
        this.steamingContainer.style.maxHeight = this.steamingContainer.scrollHeight + "px";
    }

    closeStreaming() {
        this.badgeStreaming.classList.remove("active");
        this.badgeStreamingIcon.classList.remove("active");
        this.steamingContainer.classList.remove("active");
        this.steamingContainer.style.maxHeight = null;
    }

    setBadgeStreamingActive() {
        this.badgeStreaming.classList.add("active");
    }

    createStreamingOffer(provider) {
        const img = this.createElement("img", "streaming-offer-img");
        img.src = provider.img;
        img.width = 32;  // set img size manually to reserve the correct amount of space
        img.height = 32;  // img is 2rem x 2rem = 32 x 32
        const label = this.createElement("span", "streaming-offer-label");
        label.textContent = provider.label;
        const link = this.createElement("a", "streaming-offer", [img, label]);
        link.href = provider.link;
        link.target = "_blank";
        return link;
    }

    createStreamingOffers(providers) {
        if (providers.length > 0) {
            providers.forEach(provider => {
                this.streamingProviders.appendChild(this.createStreamingOffer(provider));
            });
        } else {
            const label = this.createElement("span", "streaming-offer-label");
            label.textContent = "No streaming offers found";
            this.streamingProviders.appendChild(label);
        }
    }

    createStreaming() {
        this.streamingProviders = this.createElement("div", "container-streaming");
        this.steamingContainer = this.createElement("div", "container-streaming-wrapper", this.streamingProviders);
        return this.steamingContainer;
    }
    
    /****** Body > Summary ******/

    cardSummary() {
        const cardSummary = this.createElement("p", "card-summary");
        if(this.record.movie.summary) cardSummary.innerHTML = this.record.movie.summary;
        return cardSummary;
    }

    /****** Body > Footer ******/

    cardFooter() {
        const cardUser = this.cardUser();
        const cardActions = this.cardActions();
        return this.createElement("div", "card-footer", [cardUser, cardActions]);
    }

    /****** Body > Footer > User (left) ******/

    cardUser() {
        const cardUser = this.createElement("p", "card-user-name");
        const cardDate = this.createElement("p", "card-user-date");
        if (this.record.meta && this.record.meta.userId) {
            cardUser.textContent = this.record.meta.userId;
        }
        if (this.record.meta && this.record.meta.dateAdded) {
            cardDate.textContent = this.formatDate(this.record.meta.dateAdded);
        }
        return this.createElement("div", "card-user", [cardUser, cardDate]);
    }

    /****** Body > Footer > Actions (right) ******/

    cardActions() {
        const buttonImdb = this.cardActionImdb(this.record.movie.imdb);
        const buttonYoutube = this.cardActionYoutube(this.record.movie.name);
        const pipe = this.cardActionPipe();
        const buttonAction = this.cardActionButton();
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

    cardActionButton() {
        const action = this.record.meta ? Card.ACTION_DELETE : Card.ACTION_ADD;
        this.actionButtonIcon = this.createElement("i");
        this.setActionButtonIcon(action);
        this.actionButton = this.createElement("button", "button-card", this.actionButtonIcon);
        this.actionButton.type = "button";
        this.setActionButtonListener(action);
        return this.actionButton;
    }

    setActionButtonIcon(action) {
        switch (action) {
            case Card.ACTION_ADD:
                this.setClass(this.actionButtonIcon, "fa-solid fa-plus fa-fw");
                break;
            case Card.ACTION_DELETE:
                this.setClass(this.actionButtonIcon, "fa-solid fa-trash-can fa-fw");
                break;
        }
    }

    setActionButtonListener(action) {
        switch (action) {
            case Card.ACTION_ADD:
                this.actionButton.addEventListener("click", () => this.cb(Card.ACTION_ADD, this), { once: true });
                break;
            case Card.ACTION_DELETE:
                this.actionButton.addEventListener("click", () => this.cb(Card.ACTION_DELETE, this), { once: true });
                break;
        }
    }

    setActionButtonSpinner() {
        this.setClass(this.actionButtonIcon, "fas fa-spinner fa-spin fa-fw");
    }

    /****** Helper functions ******/

    createElement(tagName, className, children) {
        const elem = document.createElement(tagName);

        if (className) {
            this.setClass(elem, className);
        }
    
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

    setClass(elem, cls) {
        elem.className = cls;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString("en-us",
            {
                weekday: undefined,
                year: "numeric",
                month: "short",
                day: "numeric"
            })
    }
}