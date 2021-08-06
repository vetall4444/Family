'use strict'
//ClassCard
window.addEventListener('DOMContentLoaded', () => {
    const FoodWindow = document.querySelector('.FoodCards');
    const FoodCards = document.querySelector('.FoodCards-inner');
    FoodCards.style.transition = '0.5s all';
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
    //const first = new CardFood('spagetti', 'img/spagetti.JPG', 'Спагетти', 'Итальянское название длинной прямой вермишели, нитевидных макаронных изделий длиной до 50-75 см и диаметром около 2 мм. Родиной спагетти является Италия, и они широко используются витальянской кухне, часто подаются с томатным соусом.');
    //const second = new CardFood('beer', 'img/beer.JPG', 'Пиво', 'Слабоалкогольный напиток, получаемый спиртовым брожением солодового сусла (чаще всего на основе ячменя) с помощью пивных дрожжей, обычно с добавлением хмеля.');
    //const third = new CardFood('rolls', 'img/rolls.JPG', 'Роллы', 'Одна из разновидностей суши в японской кухне, отличительной особенностью которой является скручивание при помощи бамбуковой циновки в цилиндрическую форму, с последующим разрезанием на дольки.');
    //FoodCards.innerHTML += first.render();
    //FoodCards.innerHTML += second.render();
    //FoodCards.innerHTML += third.render();

    //Timer
    const timeBlock = document.querySelector('.TimeOver');
    const hours = timeBlock.querySelector('#Hours p');
    const minutes = timeBlock.querySelector('#Minutes p');
    const seconds = timeBlock.querySelector('#Seconds p');
    const deadLine = new Date('2021', '07', "10", "12", '56', '48');
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
    const modalForm = document.querySelector('form');
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

    /* function postData(initForm) {
        initForm.addEventListener('submit', e => {
            e.preventDefault();
            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-Type', 'application/json');
            const formData = new FormData(initForm);
            const obj = {};
            formData.forEach(function (value, key) {
                obj[key] = value;
            });
            const json = JSON.stringify(obj);
            request.send(json);
            request.addEventListener('load', e => {
                if (request.status === 200) {
                    console.log(request.response);
                } else {}
                initForm.reset();
            });
        });
    } */
    async function postData(initForm) {
        const formData = new FormData(initForm);
        const res = await fetch('http://localhost:3000/requests', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        })
        return await res.json();
    }
    async function bindPostData(initForm) {
        initForm.addEventListener('submit', e => {
            e.preventDefault();
            console.log(postData(initForm));
            initForm.reset();
        });
    }
    bindPostData(modalForm);

    async function getCards() {
        const c = await fetch('http://localhost:3000/menu');
        return await c.json();
    }

    async function showCards() {
        await getCards()
            .then(data => data.forEach(({
                img,
                altimg,
                title,
                descr
            }) => {
                FoodCards.innerHTML += new CardFood(altimg, img, title, descr).render();
            }));
    }
    let position = 0;
    async function wait() {
        await showCards();
        const oneCard = document.querySelectorAll('.FoodCard');
        const countCard = document.querySelectorAll('.FoodCard').length;
        const width = oneCard[0].offsetWidth;
        FoodWindow.style.width = width * 3 + "px";
        FoodWindow.style.overflow = "hidden";
        FoodCards.style.width = width * countCard - 3 + "px";
        const left = document.querySelector('.Arrow.left');
        const right = document.querySelector('.Arrow.right');
        left.addEventListener('click', e => {
            if (position > width * (countCard - 3)-1)
                position = 0;
            else
                position += width;
            FoodCards.style.transform = `translateX(-${position}px)`;
            console.log(position);


        });
        right.addEventListener('click', e => {
            if (position < 1)
                position = width * (countCard - 3);
            else
                position -= width;
            console.log(position);
            FoodCards.style.transform = `translateX(-${position}px)`;
        });

    }
    wait();

});