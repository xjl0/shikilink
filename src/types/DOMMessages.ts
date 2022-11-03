export type DOMMessage = {
    type: 'GET_DOM'
}

export type DOMMessageResponse = {
    title: string;
    metaContent: string;
    description: string;
    poster: string;
}

export enum Sender {
    React,
    Content,
}

export interface ChromeMessage {
    from: Sender,
    message: any
}