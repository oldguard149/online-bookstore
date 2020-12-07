export interface IGenre {
    genre_id: number;
    name: string;
};

export interface IPublisher {
    publisher_id: number;
    name: string;
    email?: string;
    address?: string;
}

export interface IBook {
    isbn: string;
    name: string;
    image_url: string;
    Authors?: IAuthor[];
    Genre?: IGenre;
    Publisher?: IPublisher;
    summary?: string;
    available_qty?: number;
    price?: number;
}

export interface IAuthor {
    author_id: number;
    fullname: string;
}