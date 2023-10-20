/**
* Wrapper class around an `IntersectionObserver` which lazy loads images.
* This class is used by `Card` to avoid loading images which are not in the viewport.
* An instance of `LazyLoadingObserver` is exported to enforce the singleton pattern.
* @class LazyLoadingObserver
*/
class LazyLoadingObserver {

    constructor() {
        // Creates a new `IntersectionObserver` instance with a margin of 100% (full window size)
        this.observer = new IntersectionObserver(this.handleIntersection, { rootMargin: "100%" });
    }

    /** 
    * Whenever a `Card` comes within range of 100% of the window size, the card's image is loaded.
    * @param {Array} entries    Array of intersection items, produced by `IntersectionObserver`
    */
    handleIntersection(entries) {
        entries.map(entry => {
            if (entry.isIntersecting) {
                // Item has crossed our observation threshold: load `src` from `data-src`
                entry.target.style.backgroundImage = `url('${entry.target.dataset.src}')`;
                // No need to watch this entry anymore after img is loaded
                this.unobserve(entry.target);
            }
        });
    }

    observe(target) {
        this.observer.observe(target);
    }

    unobserve(target) {
        this.observer.unobserve(target);
    }
}


// Export as new instance to enforce singleton pattern
export default new LazyLoadingObserver();