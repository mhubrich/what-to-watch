class LazyLoadingObserver {

    constructor() {
        this.observer = new IntersectionObserver(this.handleIntersection, { rootMargin: "100%" });
    }

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