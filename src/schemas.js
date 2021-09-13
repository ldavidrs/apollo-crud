const { gql } = require('apollo-server');

const typeDefs = gql`

  scalar Date

  type Artist {
    id: ID!
    name: String!
    country: String!
    albums: [Album!]
  }

  type Album {
    id: ID!
    name: String!
    genre: String!
    release_date: Date!
    cover_image: String!
    artist_id: ID!
    artist: Artist! 
    tracks: [Track!]!
  }

  type Track {
    id: ID!
    number: Int!
    name: String!
    composer: String!
    album_id: ID!
    album: Album!
  }

  type Query {
    getAllArtists: [Artist!]!
    getAllAlbums: [Album!]!
    getAllTracks: [Track!]

    getArtist(id: ID!): Artist!
    getAlbum(id: ID!): Album!
    getTrack(id: ID!): Track!
  }

  type Mutation {
    
    addArtist(
      name: String!, 
      country: String!
    ): ArtistMutationResponse!

    updateArtist(
      id: ID!,
      name: String,
      country: String
    ): ArtistMutationResponse!

    deleteArtist(
      id: ID!
    ): ArtistMutationResponse!
    
    addAlbum(
      name: String!, 
      genre: String!, 
      release_date: Date!, 
      cover_image: String!,
      artist_id: ID!
    ): AlbumMutationResponse!

    updateAlbum(
      id: ID!,
      name: String,
      genre: String,
      release_date: Date,
      cover_image: String,
      artist_id: ID
    ): AlbumMutationResponse!

    deleteAlbum(
      id: ID!
    ): AlbumMutationResponse!
    
    addTrack(
      number: Int!
      name: String!, 
      composer: String!, 
      album_id: ID!
    ): TrackMutationResponse!

    updateTrack(
      id: ID!,
      number: Int,
      name: String,
      composer: String,
      album_id: ID
    ): TrackMutationResponse!

    deleteTrack(
      id: ID!
    ): TrackMutationResponse!
  }
  
  type ArtistMutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    artist: Artist!
  }

  type AlbumMutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    album: Album!
  }

  type TrackMutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    track: Track!
  }
`;

module.exports = typeDefs;