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
    if (!isPossibleLink() && isValidDate && message.from === Sender.Content && document.getElementsByClassName('answer_is_forty_two').length === 0) {
        const linkAnime = encodeURI(document.querySelector("meta[itemprop=headline]")!.getAttribute('content')!);
        document.getElementsByClassName('c-image').item(0)!.appendChild(generateLink("Anime365", "https://smotret-anime.com/catalog/search?q=" + linkAnime));
        document.getElementsByClassName('c-image').item(0)!.appendChild(generateLink("AnimeGo.org", "https://animego.org/search/anime?q=" + linkAnime));
    }
}

const generateLink = (title: string, link: string): HTMLAnchorElement => {
    const button = document.createElement('a');
    button.target = "_blank";
    button.className = "b-link_button answer_is_forty_two";
    button.title = title;
    button.text = title;
    button.href = link;
    return button
}

const main = () => {
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
}

if (window.location.host === "shikimori.one" || window.location.host === "shikimori.org") {
    main();
}
