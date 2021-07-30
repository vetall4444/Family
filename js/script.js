'use strict'
//ClassCard
window.addEventListener('DOMContentLoaded', () => {
    const FoodCards = document.querySelector('.FoodCards');
    class CardFood {
        constructor(name, img, title, text) {
            this.name = name;
            this.img = img;
            this.title = title;
            this.text = text;
        }
        render() {
            return (
                `<div class="FoodCard">
                    <img src="${this.img}" alt="${this.name}}" />
                        <div class="FoodText">
                            <h3>${this.title}</h3>
                            <p>
                            ${this.text}
                            </p>
                        </div>
                </div>`
            );
        }
    }

    FoodCards.innerHTML = '';
    const first = new CardFood('spagetti', 'img/spagetti.JPG', 'Спагетти', 'Итальянское название длинной прямой вермишели, нитевидных макаронных изделий длиной до 50-75 см и диаметром около 2 мм. Родиной спагетти является Италия, и они широко используются витальянской кухне, часто подаются с томатным соусом.');
    const second = new CardFood('beer', 'img/beer.JPG', 'Пиво', 'Слабоалкогольный напиток, получаемый спиртовым брожением солодового сусла (чаще всего на основе ячменя) с помощью пивных дрожжей, обычно с добавлением хмеля.');
    const third = new CardFood('rolls', 'img/rolls.JPG', 'Роллы', 'Одна из разновидностей суши в японской кухне, отличительной особенностью которой является скручивание при помощи бамбуковой циновки в цилиндрическую форму, с последующим разрезанием на дольки.');
    FoodCards.innerHTML += first.render();
    FoodCards.innerHTML += second.render();
    FoodCards.innerHTML += third.render();

    //Timer
    const timeBlock = document.querySelector('.TimeOver');
    const hours = timeBlock.querySelector('#Hours p');
    const minutes = timeBlock.querySelector('#Minutes p');
    const seconds = timeBlock.querySelector('#Seconds p');
    const deadLine = new Date('2021', '06', "31", "12", '56', '48');
    const calcTime = function (overTime) {
        const current = new Date();
        const fullTime = overTime - current;
        const hours = Math.floor(fullTime / (1000 * 60 * 60));
        const minutes = Math.floor((fullTime / (1000 * 60)) % 60);
        const seconds = Math.floor((fullTime / (1000)) % 60);
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }

    function setTimer() {
        const timeRemain = calcTime(deadLine);
        hours.textContent = timeRemain.hours;
        minutes.textContent = timeRemain.minutes;
        seconds.textContent = timeRemain.seconds;
    }

    function startTimer() {
        setTimer();
        const timer = setInterval(setTimer, 1000);
    }
    startTimer();

    //Модальное окно

    const button = document.querySelector('#Modal');
    const modal = document.querySelector('.ModalForm');
    const form = document.querySelector('.color');
    const hide = function () {
        modal.classList.add('hide');
        document.body.style.overflow = 'visible';
    }
    button.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal.classList.contains('hide')) {
            modal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
        }
    });
    document.addEventListener('keydown', e => {
        if (e.code === 'Escape') {
            hide();
        }
    });
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            hide();
        }
    });

    //ТАбы и обработка нажатия
    const tabss = document.querySelectorAll('.Tab');
    const img = document.querySelectorAll('.FamilyIMG');

    function hideTabContent(imgs) {
        imgs.forEach(image => {
            image.classList.add('hide');
        });
    }

    function selectTab(tabs) {
        tabs.forEach((item, i) => {
            item.addEventListener('click', e => {
                hideTabContent(img);
                img[i].classList.remove('hide');
            });
        });
    }
    selectTab(tabss);
});