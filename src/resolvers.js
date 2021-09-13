const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');

var artists = [];
var albums = [];
var tracks = [];

try{
    artists = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./mockData/artists.json")));
}
catch(err)
{
    console.log(`Empty artists json file`);
}

try{
    albums = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./mockData/albums.json")));
}
catch(err)
{
    console.log(`Empty albums json file`);
}

try{
    tracks = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./mockData/tracks.json")));
}
catch(err)
{
    console.log(`Empty tracks json file`);
}

const httpStatus = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    BAD_REQUEST: 400
};

albums.forEach(album => {
    album.release_date = Date.parse(album.release_date);
});

const resolvers = {
    Query: {
        getAllArtists: (_, __, ___) => {
            return artists;
        },
        getAllAlbums: (_, __, ___) => {
            return albums;
        },
        getAllTracks: (_, __, ___) => {
            return tracks;
        },
        getArtist: (_, { id }, __) => {
            try {
                let artist = artists.find(x => x.id === id);

                return artist !== undefined ? artist : null;
            }
            catch (err) {
                return null;
            }
        },
        getAlbum: (_, { id }, __) => {
            try {
                let album = albums.find(x => x.id === id);

                return album !== undefined ? album : null;               
            }
            catch (err) {
                return null;
            }
        },
        getTrack: (_, { id }, __) => {
            try {
                let track = tracks.find(x => x.id === id);

                return track !== undefined ? track : null;          
            }
            catch (err) {
                return null;
            }
        }
    },
    Artist: {
        albums: ({ id }, _, __) => {
            return albums.filter(x => x.artist_id === id);
        }
    },
    Album: {
        artist: ({ artist_id }, _, __) => {
            return artists.find(x => x.id === artist_id);
        },
        tracks: ({ id }, _, __) => {
            return tracks.filter(x => x.album_id === id);
        }
    },
    Track: {
        album: ({ album_id }, _, __) => {
            return albums.find(x => x.id === album_id);
        }
    },
    Mutation: {
        addArtist: (_, { name, country }, __) => {
            try {
                if (name === undefined && country === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        artist: null
                    }

                var id = uuidv4();

                var idExists = artists.some(function (x) {
                    return x.id === id;
                });

                while (idExists) {
                    id = uuidv4();
                    idExists = artists.find(x => x.id === id);
                }

                let artist = {
                    id: id,
                    name: name,
                    country: country
                };

                artists.push(artist);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/artists.json"), JSON.stringify(artists));

                return {
                    code: httpStatus.CREATED,
                    success: true,
                    message: `Artist '${name}' added succesfully`,
                    artist: artist
                };
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    artist: null
                }
            }
        },
        updateArtist: (_, { id, name, country }, __) => {
            try {

                if (name === undefined && country === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        artist: null
                    }

                var artist = artists.find(x => x.id === id);

                if (artist === undefined) {
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Artist with id ${id} not found`,
                        artist: null
                    }
                }

                if (name !== undefined) artist.name = name;

                if (country !== undefined) artist.country = country;

                artists = artists.filter(x => x.id != artist.id);

                artists.push(artist);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/artists.json"), JSON.stringify(artists));

                return {
                    code: httpStatus.OK,
                    success: true,
                    message: `Artist data updated succesfully`,
                    artist: artist
                }
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    artist: null
                }
            }
        },
        deleteArtist: (_, { id }, __) => {
            try {
                if (id === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        artist: null
                    }

                var artist = artists.find(x => x.id === id);

                if (artist === undefined)
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Artist with id ${id} not found`,
                        artist: null
                    }

                artists = artists.filter(x => x.id !== id);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/artists.json"), JSON.stringify(artists));

                return {
                    code: httpStatus.OK,
                    success: true,
                    message: `Artist deleted succesfully`,
                    artist: null
                }
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    artist: null
                }
            }
        },
        addAlbum: (_, { name, genre, release_date, cover_image, artist_id }, __) => {
            try {
                if (name === undefined || genre === undefined || release_date === undefined
                    || cover_image === undefined || artist_id === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        album: null
                    }

                var id = uuidv4();

                var idExists = albums.some(function (x) {
                    return x.id === id;
                });

                while (idExists) {
                    id = uuidv4();
                    idExists = albums.find(x => x.id === id);
                }

                let artist = artists.find(x => x.id === artist_id);

                if (artist === undefined)
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Artist with id ${artist_id} was not found`,
                        album: null
                    }

                let album = {
                    id: id,
                    name: name,
                    genre: genre,
                    release_date: release_date,
                    cover_image: cover_image,
                    artist_id: artist_id
                };

                albums.push(album);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/albums.json"), JSON.stringify(albums));

                return {
                    code: httpStatus.CREATED,
                    success: true,
                    message: `Album '${name}' added succesfully`,
                    album: album
                };
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    album: null
                }
            }
        },
        updateAlbum: (_, { id, name, genre, release_date, cover_image, artist_id }, __) => {
            try {
                if (name === undefined && genre === undefined && release_date === undefined
                    && cover_image === undefined && artist_id === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        album: null
                    }

                var album = albums.find(x => x.id === id);

                if (album === undefined) {
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Album with id ${id} not found`,
                        album: null
                    }
                }

                if (name !== undefined) album.name = name;

                if (genre !== undefined) album.genre = genre;

                if (release_date !== undefined) album.release_date = release_date;

                if (cover_image !== undefined) album.cover_image = cover_image;

                if (artist_id !== undefined) album.artist_id = artist_id;

                albums = albums.filter(x => x.id != album.id);

                albums.push(album);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/albums.json"), JSON.stringify(albums));

                return {
                    code: httpStatus.OK,
                    success: true,
                    message: `Album data updated succesfully`,
                    album: album
                }
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    album: null
                }
            }
        },
        deleteAlbum: (_, { id }, __) => {
            try {
                if (id === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        album: null
                    }

                var album = albums.find(x => x.id === id);

                if (album === undefined)
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Album with id "${id}" was not found"`,
                        album: null
                    }

                albums = albums.filter(x => x.id !== id);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/albums.json"), JSON.stringify(albums));

                return {
                    code: httpStatus.OK,
                    success: true,
                    message: `Album deleted succesfully`,
                    album: null
                }
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    album: null
                }
            }
        },
        addTrack: (_, { number, name, composer, album_id }, __) => {
            try {
                if (number === undefined || name === undefined || composer === undefined || album_id === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        track: null
                    }

                var id = uuidv4();

                var idExists = tracks.some(function (x) {
                    return x.id === id;
                });

                while (idExists) {
                    id = uuidv4();
                    idExists = tracks.find(x => x.id === id);
                }

                let track = {
                    id: id,
                    number: number,
                    name: name,
                    composer: composer,
                    album_id: album_id
                };

                tracks.push(track);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/tracks.json"), JSON.stringify(tracks));

                return {
                    code: httpStatus.CREATED,
                    success: true,
                    message: `Track '${name}' added succesfully`,
                    track: track
                };
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    track: null
                }
            }
        },
        updateTrack: (_, { id, number, name, composer, album_id }, __) => {
            try {
                if (number === undefined && name === undefined && composer === undefined
                    && album_id === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        track: null
                    }

                var track = track.find(x => x.id === id);

                if (track === undefined) {
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Track with id "${id}" not found`,
                        track: null
                    }
                }

                if (number !== undefined) track.number = number;

                if (name !== undefined) track.name = name;

                if (composer !== undefined) track.composer = composer;

                let album = albums.find(x => x.id == album_id);

                if (album === undefined)
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Album with id "${album_id}" was not found"`,
                        track: null
                    }

                if (album_id !== undefined) track.album_id = album_id;

                tracks = tracks.filter(x => x.id != track.id);

                tracks.push(track);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/tracks.json"), JSON.stringify(tracks));

                return {
                    code: httpStatus.OK,
                    success: true,
                    message: `Track data updated succesfully`,
                    track: track
                }
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    track: null
                }
            }
        },
        deleteTrack: (_, { id }, __) => {
            try {
                if (id === undefined)
                    return {
                        code: httpStatus.BAD_REQUEST,
                        success: false,
                        message: `Incorrect request format`,
                        album: null
                    }

                var track = tracks.find(x => x.id === id);

                if (track === undefined)
                    return {
                        code: httpStatus.NOT_FOUND,
                        success: false,
                        message: `Track with id "${album_id}" was not found"`,
                        track: null
                    }

                tracks = tracks.filter(x => x.id !== id);

                fs.writeFileSync(path.resolve(__dirname, "./mockData/tracks.json"), JSON.stringify(tracks));

                return {
                    code: httpStatus.OK,
                    success: true,
                    message: `Track deleted succesfully`,
                    track: null
                }
            }
            catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: err.extensions.response.body,
                    track: null
                }
            }
        }
    }
};

module.exports = resolvers;