class MovieType {
    static Movie = new MovieType("Movie");
    static Show = new MovieType("TV Show");
  
    constructor(name) {
      this.name = name
    }

    static isValid(obj) {
        if (!obj.hasOwnProperty('name')) {
            return false;
        }
        return true;
    }
}

class Movie {
    constructor(id, name, type, poster, rating, summary) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.poster = poster;
        this.rating = rating;
        this.summary = summary;
    }

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
        if (!obj.hasOwnProperty('rating')) {
            return false;
        }
        if (!obj.hasOwnProperty('summary')) {
            return false;
        }
        return true;
    }
}


module.exports = { Movie, MovieType };