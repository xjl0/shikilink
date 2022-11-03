export {}

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

if (!document.getElementById("answer_is_forty_two")){
    const linkAnime = encodeURI(document.querySelector("meta[itemprop=headline]")!.getAttribute('content')!);
    const div = document.createElement('div');
    div.id = "answer_is_forty_two";

    document.getElementsByClassName('c-image').item(0)!.appendChild(div).appendChild(generateLink("Anime365", "https://smotret-anime.com/catalog/search?q=" + linkAnime));
    document.getElementsByClassName('c-image').item(0)!.appendChild(div).appendChild(generateLink("AnimeGo.org", "https://animego.org/search/anime?q=" + linkAnime));
}



