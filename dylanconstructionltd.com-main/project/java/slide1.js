const wrapper1 = document.querySelector(".wrapper1");
const carousel1 = wrapper1.querySelector(".carousel1");
const firstCardWidth1 = carousel1.querySelector(".card1").offsetWidth;
const arrowBtns1 = document.querySelectorAll(".wrapper1 i");
const carouselChildrens1 = [...carousel1.children];

let isDragging1 = false, isAutoPlay1 = true, startX1, startScrollLeft1, timeoutId1;

let cardPerView1 = Math.round(carousel1.offsetWidth / firstCardWidth1);

carouselChildrens1.slice(-cardPerView1).reverse().forEach(card => {
    carousel1.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildrens1.slice(0, cardPerView1).forEach(card => {
    carousel1.insertAdjacentHTML("beforeend", card.outerHTML);
});

carousel1.classList.add("no-transition");
carousel1.scrollLeft = carousel1.offsetWidth;
carousel1.classList.remove("no-transition");

arrowBtns1.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel1.scrollLeft += btn.id == "left1" ? -firstCardWidth1 : firstCardWidth1;
    });
});

const dragStart1 = (e) => {
    isDragging1 = true;
    carousel1.classList.add("dragging");
    startX1 = e.pageX;
    startScrollLeft1 = carousel1.scrollLeft;
}

const dragging1 = (e) => {
    if (!isDragging1) return;
    carousel1.scrollLeft = startScrollLeft1 - (e.pageX - startX1);
}

const dragStop1 = () => {
    isDragging1 = false;
    carousel1.classList.remove("dragging");
}

const infiniteScroll1 = () => {
    if (carousel1.scrollLeft === 0) {
        carousel1.classList.add("no-transition");
        carousel1.scrollLeft = carousel1.scrollWidth - (2 * carousel1.offsetWidth);
        carousel1.classList.remove("no-transition");
    } else if (Math.ceil(carousel1.scrollLeft) === carousel1.scrollWidth - carousel1.offsetWidth) {
        carousel1.classList.add("no-transition");
        carousel1.scrollLeft = carousel1.offsetWidth;
        carousel1.classList.remove("no-transition");
    }
    clearTimeout(timeoutId1);
    if (!wrapper1.matches(":hover")) autoPlay1();
}

const autoPlay1 = () => {
    if (window.innerWidth < 800 || !isAutoPlay1) return;
    timeoutId1 = setTimeout(() => carousel1.scrollLeft += firstCardWidth1, 2500);
}
autoPlay1();

carousel1.addEventListener("mousedown", dragStart1);
carousel1.addEventListener("mousemove", dragging1);
document.addEventListener("mouseup", dragStop1);
carousel1.addEventListener("scroll", infiniteScroll1);
wrapper1.addEventListener("mouseenter", () => clearTimeout(timeoutId1));
wrapper1.addEventListener("mouseleave", autoPlay1);
