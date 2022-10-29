import { DOMMessage, DOMMessageResponse } from '../types';

const messagesFromReactAppListener = (msg: DOMMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: DOMMessageResponse) => void) => {

    const response: DOMMessageResponse = {
        title: document.title,
        metaContent: document.querySelector("meta[itemprop=headline]")!.getAttribute('content')!,
        description: document.getElementsByClassName("b-text_with_paragraphs").item(1)!.innerHTML,
        poster: document.getElementsByClassName("c-poster").item(0)!.getElementsByTagName("img")[0].src
    };

    sendResponse(response)
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);