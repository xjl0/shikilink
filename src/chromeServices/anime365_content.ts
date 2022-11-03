export {}
let timerId: string | number | NodeJS.Timeout | undefined;
let countNextPage: number = 0;
let countTimerOut: number = 0;
chrome.runtime.onMessage.addListener(function (request) {
    // Получаем сообщение от background что страница готова
    if (request && request.type === 'page-rendered-anime365') {
        //Очистим таймер если есть
        clearInterval(timerId);
        //Обнулим таймер перехода
        countTimerOut = 0;
        //Проверим наличие плеера
        if (document.getElementById("videoFrame")) {
            const videoFrame = document.getElementById("videoFrame")!;
            const iFrame = (<HTMLIFrameElement>videoFrame).contentWindow;
            //Запустим таймер
            timerId = setTimeout(function tick() {
                //Получим состояние полоски загрузки
                const str = iFrame!.document.getElementsByClassName("vjs-play-progress").item(0)!.getAttribute("style")!.trim();
                countNextPage = parseInt(str.replace(/^width: ([0-9]{1,2})(.{0,1})?([0-9]{0,2})?%;$/, "$1"));
                //Если просмотренно более 96% тайтла запускаем отображение пропуска
                if (videoFrame && countNextPage >= 96) {
                    //Вернём наличие нашего блока
                    const mainBlock = iFrame!.document.getElementById("answer_is_forty_two");
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
                            iFrame!.document.getElementById("answer_is_forty_two")?.remove();
                            countTimerOut = 0;
                        }
                        div.appendChild(a).appendChild(span);
                        const styleElem = iFrame!.document.head.appendChild(document.createElement("style"));
                        styleElem.innerHTML = "#answer_is_forty_two{background-color: #ff6d0033; border-radius: 2px; position:absolute; bottom:70px; right:20px; transform: translate(-50%, -50%);}" +
                            "#answer_is_forty_two a{display: block; cursor: pointer; width: 200px; height: 40px; line-height: 40px; font-size: 18px; font-family: sans-serif; text-decoration: none; color: #333;border: 1px solid #333;letter-spacing: 2px;text-align: center;position: relative;transition: all .35s;}" +
                            "#answer_is_forty_two a:after{position: absolute; content: \"\"; top: 0; left: 0; width: var(--width, 0); height: 100%; background: #ff6d00; transition: all .35s;}" +
                            "#answer_is_forty_two a:hover{color: #fff; background: #ff6d0088;}" +
                            "#answer_is_forty_two a span{position: relative; z-index: 2;}";
                        //Добавим блок во фрейм
                        const container = iFrame!.document.getElementsByClassName("vjs-control-bar").item(0)!;
                        const parent = container.parentNode!
                        parent.insertBefore(div, container)
                    } else {
                        //Считаем 25 секунд и переходим по ссылке
                        countTimerOut++;
                        if (countTimerOut >= 25) {
                            document.location.href = document.getElementsByClassName("m-select-sibling-episode").item(0)!.getElementsByTagName("a").item(1 || 0)!.href;
                        }
                        //Визуализируем счётчик
                        mainBlock.getElementsByTagName("a").item(0)!.style.setProperty("--width", (countTimerOut * 100) / 25 + "%");
                    }
                } else {
                    //Если ещё не досмотрено 96% то ничего не делаем
                    countTimerOut = 0;
                    iFrame!.document.getElementById("answer_is_forty_two")?.remove();
                }
                timerId = setTimeout(tick, 1000); // (*)
            }, 1000);

        }
    }
});

