export type DOMMessage = {
    type: 'GET_DOM'
}

export type DOMMessageResponse = {
    title: string;
    metaContent: string;
    description: string;
    poster: string;
}