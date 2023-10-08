/**
 * Card
 *   - Image (left column)
 *   - Body (right column)
 *     - Title
 *     - Badges
 *       - Type, Year, Runtime, Genres, Rating
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
    
    static createCard(record, cbStream, cbAction) {
        const card = new Card();
        const cardImg = card.cardImg(record.movie.poster);
        const cardBody = card.cardBody(record, cbStream, cbAction);
        return card.createElement("div", "card", [cardImg, cardBody]);
    }

    createElement(tagName, className, children) {
        const elem = document.createElement(tagName);

        if (className) {
            elem.className = className;
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

    /****** Image (left) ******/

    cardImg(url) {
        const img = this.createElement("div", "card-img");
        if(url) img.style.backgroundImage = `url(${url})`;
        return img;
    }

    /****** Body (right) ******/

    cardBody(record, cbStream, cbAction) {
        const cardTitle = this.cardTitle(record.movie.name);
        const cardBadges = this.cardBadges(record);
        const [streamingBadge, streamingContainer] = this.cardStreaming(record, cbStream);
        cardBadges.append(streamingBadge);
        const cardStreaming = streamingContainer;
        const cardSummary = this.cardSummary(record.movie.summary);
        const cardFooter = this.cardFooter(record, cbAction);
        const children = [cardTitle, cardBadges, cardStreaming, cardSummary, cardFooter];
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
            if (record.movie.rating) badges.push(this.cardRating(record.movie.rating));
            if (record.movie.genre) badges.push(this.cardBadgeGenre(record.movie.genre));
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

    cardRating(rating) {
        const badgeIcon = this.createElement("span", "fa fa-star");
        const badgeLabel = this.createElement("span", "badge-label");
        badgeLabel.textContent = `\xa0${rating}`;  // adds whitespace at the beginning
        return  this.createElement("div", "badge", [badgeIcon, badgeLabel]);
    }

    // cardRating(rating) {
    //     rating = rating / 2; // convert from range [0, 10] to [0, 5]
    //     rating = this.toNearestHalf(rating);
    //     const badges = this.createElement("div", "badge");
    //     const stars = this.getNumStars(rating);
    //     for (let i = 0; i < stars.full; i++) {
    //         badges.appendChild(this.createElement("span", "fa fa-star"));
    //     }
    //     for (let i = 0; i < stars.half; i++) {
    //         badges.appendChild(this.createElement("span", "fa fa-star-half-stroke"));
    //     }
    //     for (let i = 0; i < stars.empty; i++) {
    //         badges.appendChild(this.createElement("span", "fa-regular fa-star"));
    //     }
    //     return badges;
    // }

    /****** Body > Streaming Providers ******/

    cardStreaming(record, cb) {
        const streamingContainer = this.createElement("div", "container-streaming");
        const wrapper = this.createElement("div", "container-streaming-wrapper", streamingContainer);
        const badgeLabel = this.createElement("span", "badge-label");
        badgeLabel.textContent = `Streaming\xa0`; // adds whitespace at the end
        const badgeIcon = this.createElement("span", "fa-solid fa-chevron-down badge-icon");
        const cardBadgeStreaming = this.createElement("div", "badge collapsible", [badgeLabel, badgeIcon]);
        cardBadgeStreaming.addEventListener("click", () => {
            if (wrapper.style.maxHeight) {  // check if wrapper has class active
                cardBadgeStreaming.classList.remove("active");
                badgeIcon.classList.remove("active");
                wrapper.style.maxHeight = null;
            } else {
                cardBadgeStreaming.classList.add("active");
                let q = Promise.resolve();
                if (streamingContainer.childElementCount == 0) {
                    q = cb(record.movie.id, record.movie.type.name)
                    .then(providers => {
                        if (providers.length > 0) {
                            providers.forEach(provider => {
                                const img = this.createElement("img", "streaming-offer-img");
                                img.src = provider.img;
                                const label = this.createElement("span", "streaming-offer-label");
                                label.textContent = provider.label;
                                const link = this.createElement("a", "streaming-offer", [img, label]);
                                link.href = provider.link;
                                link.target = "_blank";
                                streamingContainer.appendChild(link);
                            });
                        } else {
                            const label = this.createElement("span", "streaming-offer-label");
                            label.style.margin = 0;
                            label.textContent = "No streaming providers found";
                            streamingContainer.appendChild(label);
                        }
                    });
                }
                q.then(() => {
                    badgeIcon.classList.add("active");
                    wrapper.style.maxHeight = wrapper.scrollHeight + "px";
                });
            }
        });
        return [cardBadgeStreaming, wrapper];
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
        const cardUser = this.createElement("p", "card-user-name");
        const cardDate = this.createElement("p", "card-user-date");
        if (record && record.meta && record.meta.userId) {
            cardUser.textContent = record.meta.userId;
        }
        if (record && record.meta && record.meta.dateAdded) {
            cardDate.textContent = this.formatDate(record.meta.dateAdded);
        }
        return this.createElement("div", "card-user", [cardUser, cardDate]);
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
            })
    }
}