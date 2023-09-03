/**
 * Helper class to reference two static movie types (`Movie` and `Show`).
 * @class MovieType
 */
class MovieType {
    static Movie = new MovieType("Movie");
    static Show = new MovieType("TV Show");
  
    /**
     * Creates an instance of `MovieType`.
     * @param {String} name The name of the movie type.
     */
    constructor(name) {
      this.name = name
    }

    /**
     * Verifies if given object has property `name`.
     * @static
     * @param {Object} obj  The object to test.
     * @return {Boolean}    True, if `obj` has property `name`, false otherwise.
     */
    static isValid(obj) {
        if (!obj.hasOwnProperty('name')) {
            return false;
        }
        return true;
    }
}

/**
 * Object that holds a number of movie-related properties.
 * @class Movie
 */
class Movie {
    /**
     * Creates an instance of `Movie`.
     * @param {String} id       Unique identifier of the movie.
     * @param {String} name     Name of the movie.
     * @param {MovieType} type  Type of movie.
     * @param {String} poster   Path/URL to the movie poster.
     * @param {Number} year     Release year of the movie.
     * @param {String} imdb     URL to the IMDb page of the movie.
     * @param {Number} rating   Rating of the movie.
     * @param {String} summary  A brief summary of the movie.
     * @param {String} runtime  Duration of the movie.
     * @param {Array} genre     Genres of the movie.
     */
    constructor(id, name, type, poster, year, imdb, rating, summary, runtime, genre) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.poster = poster;
        this.year = year;
        this.imdb = imdb;
        this.rating = rating;
        this.summary = summary;
        this.runtime = runtime;
        this.genre = genre;
    }

    /**
     * Verifies if the given object has all properties of class `Movie`.
     * @static
     * @param {Object} obj  The object to test.
     * @return {Boolean}    True, if `obj` has all properties of class `Movie`, false otherwise.
     */
    static isValid(obj) {
        if (!obj.hasOwnProperty('id')) {
            return false;
        }
        if (!obj.hasOwnProperty('name')) {
            return false;
        }
        if (!obj.hasOwnProperty('type') || !MovieType.isValid(obj.type)) {
            return false;
        }
        if (!obj.hasOwnProperty('poster')) {
            return false;
        }
        if (!obj.hasOwnProperty('year')) {
            return false;
        }
        if (!obj.hasOwnProperty('imdb')) {
            return false;
        }
        if (!obj.hasOwnProperty('rating')) {
            return false;
        }
        if (!obj.hasOwnProperty('summary')) {
            return false;
        }
        if (!obj.hasOwnProperty('runtime')) {
            return false;
        }
        if (!obj.hasOwnProperty('genre')) {
            return false;
        }
        return true;
    }
}


module.exports = { Movie, MovieType };