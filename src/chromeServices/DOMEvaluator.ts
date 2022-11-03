import {ChromeMessage, DOMMessageResponse, Sender} from '../types';

type MessageResponse = (response?: any) => void

const validateSender = (message: ChromeMessage, sender: chrome.runtime.MessageSender) => {
    return sender.id === chrome.runtime.id;
}

const isPossibleLink = (): boolean => {
    return window.location.href.indexOf("/animes/") === -1 || document.getElementsByClassName("c-info-right").length === 0;
}

const messagesFromReactAppListener = (message: ChromeMessage, sender: chrome.runtime.MessageSender, response: MessageResponse) => {
    if (isPossibleLink()) {
        const res: DOMMessageResponse = {
            title: "Не найдено аниме",
            metaContent: "",
            description: "Вы не на странице аниме",
            poster: ""
        };
        response(res)
    }
    const isValidDate = validateSender(message, sender)
    if (isValidDate && message.from === Sender.React) {
        const res: DOMMessageResponse = {
            title: document.title,
            metaContent: document.querySelector("meta[itemprop=headline]")!.getAttribute('content')!,
            description: document.getElementsByClassName("b-text_with_paragraphs").item(1) != null ? document.getElementsByClassName("b-text_with_paragraphs").item(1)!.innerHTML : document.getElementsByClassName("b-text_with_paragraphs").item(0)!.innerHTML,
            poster: document.getElementsByClassName("c-poster").item(0)!.getElementsByTagName("img")[0].src
        };
        response(res)
    }
}

const main = () => {
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
}

if (window.location.host === "shikimori.one" || window.location.host === "shikimori.org") {
    main();
}
