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
                    <img src="${this.img}" alt="${this.name}" />
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
    //Timer
    const timeBlock = document.querySelector('.TimeOver');
    const hours = timeBlock.querySelector('#Hours p');
    const minutes = timeBlock.querySelector('#Minutes p');
    const seconds = timeBlock.querySelector('#Seconds p');
    const deadLine = new Date('2021', '07', "12", "12", '56', '48');
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

    async function postData(initForm) {
        const formData = new FormData(initForm);
        const res = await fetch('http://localhost:3000/requests', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        })
        return  res.json();
    }
    async function bindPostData(initForm) {
        initForm.addEventListener('submit', e => {
            e.preventDefault();
            initForm.reset();
        });
    }
    bindPostData(modalForm);

    async function getCards() {
        const c = await fetch('http://localhost:3000/menu');
        return  c.json();
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
    let position = 434;
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
        right.addEventListener('click', e => {
            if (position > width * (countCard - 3) - 1)
                position = 0;
            else
                position += width;
            FoodCards.style.transform = `translateX(-${position}px)`;
        });
        left.addEventListener('click', e => {
            if (position < 1)
                position = width * (countCard - 3);
            else
                position -= width;
            FoodCards.style.transform = `translateX(-${position}px)`;
        });
    }
    wait();
    let sex = 'male',
        beer,
        weight,
        height,
        koef = 1.5;

    function calcMoor() {
        const res = document.querySelector('#result');
        if (sex && beer && weight && height && koef) {
            if (sex === 'male')
                res.textContent = Math.round((3 * beer) + (0.6 * weight) + (0.8 * height) * koef);
            else if (sex === 'female') {
                res.textContent = Math.round((5 * beer) + (0.6 * weight) + (0.9 * height) * koef);
            }
        } else {
            res.textContent = '___';
        }
    }

    function getStaticData(parent) {
        const elements = document.querySelectorAll(`${parent} div`);
        elements.forEach(element => element.addEventListener('click', e => {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i] === e.target) {
                    e.target.classList.add('active');
                    if (e.target.getAttribute('id'))
                        sex = e.target.getAttribute('id');
                    else if (e.target.getAttribute('data-alco')) {
                        koef = +e.target.getAttribute('data-alco');
                    }
                } else
                    elements[i].classList.remove('active');
            }
            calcMoor();
        }));
    }

    function getDynamicData(selector) {
        const input = document.querySelector(selector);
        input.addEventListener('input', e => {
            if (input.value.match(/\D/)) {
                input.style.border = '3px solid red';
                return;
            } else {
                input.style.border = 'none';
            }
            if (e.target.getAttribute('name') === 'beer') {
                beer = input.value;
                calcMoor();
            } else if (e.target.getAttribute('name') === 'weight') {
                weight = input.value;
                calcMoor();
            } else if (e.target.getAttribute('name') === 'height') {
                height = input.value;
                calcMoor();
            }
        });
    }
    calcMoor();
    getStaticData('.alcoLevel.chooseGender');
    getStaticData('.sexGender.chooseGender');
    getDynamicData('#pivo');
    getDynamicData('#rost');
    getDynamicData('#ves');


});