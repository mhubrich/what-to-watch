class MovieType {
    static Movie = new MovieType('Movie')
    static Show = new MovieType('TV Show')
  
    constructor(name) {
      this.name = name
    }
}

class Movie {
    constructor(id, name, type, rating, poster, summary) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.rating = rating;
        this.poster = poster;
        this.summary = summary;
    }

    static isValidMovie(obj) {
        if (!(obj instanceof Movie)) {
            return false;
        }
        if (!obj.hasOwnProperty('id') || typeof obj.id != 'number') {
            return false;
        }
        if (!obj.hasOwnProperty('name') || typeof obj.name != 'string' || obj.name.length == 0) {
            return false;
        }
        if (!obj.hasOwnProperty('type') || !(obj.type instanceof MovieType)) {
            return false;
        }
        if (!obj.hasOwnProperty('rating') || typeof obj.rating != 'number' || obj.rating < 1 || obj.rating > 10) {
            return false;
        }
        if (!obj.hasOwnProperty('poster') || typeof obj.poster != 'string' || obj.poster.length == 0) {
            return false;
        }
        if (!obj.hasOwnProperty('summary') || typeof obj.summary != 'string' || obj.summary.length == 0) {
            return false;
        }
        return true;
    }
}