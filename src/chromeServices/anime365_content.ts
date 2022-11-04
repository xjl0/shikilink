export {}
let timerId: string | number | NodeJS.Timeout | undefined;
let countCurrentTime: number = 0;
let countDurationTime: number = 0;
let styleElem: HTMLStyleElement | undefined;
let hrefChevronRight: string;
chrome.runtime.onMessage.addListener(function (request) {
    // Получаем сообщение от background что страница готова
    if (request && request.type === 'page-rendered-anime365') {
        //Очистим таймер если есть
        clearInterval(timerId);
        //Проверим наличие плеера
        if (document.getElementById("videoFrame")) {
            const videoFrame = document.getElementById("videoFrame")!;
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const iFrame = (<HTMLIFrameElement>videoFrame).contentWindow;
            //Пределим наличие кнопки на следующую серию
            if (document.getElementsByClassName("m-select-sibling-episode").item(0)?.getElementsByTagName("i").item(1)){
                hrefChevronRight = document.getElementsByClassName("m-select-sibling-episode").item(0)?.getElementsByTagName("a").item(1)?.href || "/";
            }else if(document.getElementsByClassName("m-select-sibling-episode").item(0)?.getElementsByTagName("i").item(0)?.textContent === "chevron_right"){
                hrefChevronRight = document.getElementsByClassName("m-select-sibling-episode").item(0)?.getElementsByTagName("a").item(0)?.href || "/";
            }else{
                hrefChevronRight = "/";
            }
            //Запустим таймер
            timerId = setTimeout(function tick() {
                //Получим состояние видео
                countCurrentTime = iFrame?.document.getElementsByTagName("video").item(0)?.currentTime || 0;
                countDurationTime = iFrame?.document.getElementsByTagName("video").item(0)?.duration || 0;
                //Если до конца тайтла осталось 15 секунд покажем блок
                if (videoFrame && countDurationTime - 15 <= countCurrentTime && countDurationTime > 0 && countCurrentTime > 0 && hrefChevronRight !== "/") {
                    //Вернём наличие нашего блока
                    const mainBlock = iFrame?.document.getElementById("answer_is_forty_two");
                    //Если блока нет
                    if (!mainBlock) {
                        //Созданим элементы блока
                        const div = document.createElement('div');
                        const a = document.createElement('a');
                        const span = document.createElement('span');
                        div.id = "answer_is_forty_two";
                        span.innerText = "Далее";
                        a.title = "Нажмите чтобы отменить";
                        a.onclick = function () {
                            //При нажатии на блок очистим таймер и удалим блок
                            clearInterval(timerId);
                            iFrame?.document.getElementById("answer_is_forty_two")?.remove();
                            styleElem?.remove();
                        }
                        div.appendChild(a).appendChild(span);
                        styleElem = iFrame?.document.head.appendChild(document.createElement("style"));
                        styleElem!.innerHTML = "#answer_is_forty_two{background-color: #ff6d0033; position:absolute; bottom:10%; right:5%;}" +
                            "#answer_is_forty_two a{border-radius: 2px; display: block; cursor: pointer; width: 200px; height: 40px; line-height: 40px; font-size: 18px; font-family: sans-serif; text-decoration: none; color: #fff;border: 1px solid #fff;letter-spacing: 2px;text-align: center;position: relative;transition: all .35s;}" +
                            "#answer_is_forty_two a:after{border-radius: 2px; position: absolute; content: \"\"; top: 0; left: 0; width: var(--width, 0); height: 100%; background: #ff6d00; transition: all .35s;}" +
                            "#answer_is_forty_two a:hover{color: #fff; background: #ff6d0088;}" +
                            "#answer_is_forty_two a span{position: relative; z-index: 2;}";
                        //Добавим блок во фрейм
                        const container = iFrame?.document.getElementsByClassName("vjs-control-bar").item(0)!;
                        const parent = container.parentNode!
                        parent.insertBefore(div, container)
                    } else {
                        //Если дошли до конца то переходим по ссылке
                        if (countCurrentTime === countDurationTime && hrefChevronRight !== "/") {
                            //Проверить возможность сохранить в память состояние плеера, после перехода на следующую серию вернуть. fullscreen, play/pause
                            document.location.href = hrefChevronRight;
                        }
                        //Визуализируем счётчик
                        mainBlock.getElementsByTagName("a").item(0)?.style.setProperty("--width", ((countDurationTime - countCurrentTime - 15) * 100 * -1) / 15 + "%");
                    }
                } else {
                    iFrame?.document.getElementById("answer_is_forty_two")?.remove();
                    styleElem?.remove();
                }
                timerId = setTimeout(tick, 500);
            }, 500);

        }
    }
});