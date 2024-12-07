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

if (window.location.host === "shikimori.me" || window.location.host === "shikimori.one" || window.location.host === "shikimori.org") {
    main();
}

const generateLink = (title: string, link: string): HTMLAnchorElement => {
    const button = document.createElement('a');
    button.target = "_blank";
    button.className = "b-link_button";
    button.title = title;
    button.text = title;
    button.href = link;
    button.rel = "nofollow noopener noreferrer";
    return button
}

chrome.runtime.onMessage.addListener(function(request) {
    if (request && request.type === 'page-rendered') {
        if (!document.getElementById("answer_is_forty_two") && window.location.href.indexOf("/animes/") !== -1 && document.getElementsByClassName('c-image').length !== 0 && document.querySelector("meta[itemprop=headline]") !== null){
            const linkAnime = encodeURI(document.querySelector("meta[itemprop=headline]")!.getAttribute('content')!);
            const div = document.createElement('div');
            div.id = "answer_is_forty_two";
            document.getElementsByClassName('c-image').item(0)!.appendChild(div).appendChild(generateLink("anime365.ru", "https://anime365.ru/catalog/search?q=" + linkAnime));
            document.getElementsByClassName('c-image').item(0)!.appendChild(div).appendChild(generateLink("anime365.ru", "https://anime-365.ru/catalog/search?q=" + linkAnime));
            document.getElementsByClassName('c-image').item(0)!.appendChild(div).appendChild(generateLink("AnimeGo.org", "https://animego.org/search/anime?q=" + linkAnime));
        }
    }
});

