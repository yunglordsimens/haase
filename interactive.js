async function init() {
  const node = document.querySelector("#type-text");

  node.innerText = "";

  let inViewport = false;
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    inViewport = entry.isIntersecting;
  });
  observer.observe(node);

  while (true) {
    if (inViewport) {
      await node.type("HAASE", "Arial");
      await sleep(1000);
      await node.delete("HAASE");
      await sleep(500);
      await node.type("ⰳⰰⰰⰸⰵ", "glagol");
      await sleep(1000);
      await node.delete("ⰳⰰⰰⰸⰵ");
      await sleep(500);
    } else {
      await sleep(1000);
    }
  }
}

// Source code 🚩

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

class TypeAsync extends HTMLSpanElement {
  get typeInterval() {
    const randomMs = 200 * Math.random() + 100; // Random interval between 100ms and 400ms
    return randomMs;
  }

  async type(text, font1, font2) {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const font = i % 2 === 0 ? font1 : font2;
      this.style.fontFamily = font;

      for (let j = 0; j < word.length; j++) {
        this.innerText += word[j];
        await sleep(this.typeInterval);
      }
      if (i !== words.length - 1) {
        this.innerText += " ";
      }
    }
    await sleep(500); // Delay after typing the entire text
  }

  async delete(text) {
    const length = this.innerText.length;
    const deleteInterval = Math.floor(500 / length); // Distribute the deletion over 500ms
    for (let i = length; i >= 0; i--) {
      this.innerText = text.substring(0, i);
      await sleep(deleteInterval);
    }
  }
}

customElements.define("type-async", TypeAsync, { extends: "span" });

init();

//
const scrollContainer = document.querySelector(".link-m");

function handleResize() {
  if (window.innerWidth < 1000) {
    scrollContainer.addEventListener("wheel", handleWheelScroll);
  } else {
    scrollContainer.removeEventListener("wheel", handleWheelScroll);
  }
}

function handleWheelScroll(evt) {
  evt.preventDefault();
  scrollContainer.scrollLeft += evt.deltaY;
}

window.addEventListener("resize", handleResize);
handleResize();

//
// Переменные для отслеживания состояния перетаскивания
let isDragging = false;
let draggedImage = null;
let offsetX = 0;
let offsetY = 0;
let isDoubleTap = false;

// Обработчики событий мыши и touch-событий для перемещения изображений
document.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', dragImage);
document.addEventListener('mouseup', stopDragging);
document.addEventListener('touchstart', startDragging);
document.addEventListener('touchmove', dragImage);
document.addEventListener('touchend', stopDragging);

// Обработчик события нажатия клавиши Escape
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    // Удаляем все копии изображений
    const clonedImages = document.querySelectorAll('.cloned-img');
    clonedImages.forEach(img => img.remove());
  }
});

// Функция начала перетаскивания
function startDragging(event) {
  if (event.type === 'mousedown' && event.button !== 0) {
    return; // Если нажата не левая кнопка мыши, выходим из функции
  }

  if (event.type === 'touchstart') {
    if (!isDoubleTap) {
      isDoubleTap = true;
      setTimeout(() => {
        isDoubleTap = false;
      }, 300); // Устанавливаем таймер на сброс двойного касания через 300 миллисекунд
      return; // Если это первое касание, выходим из функции
    }
  }

  const target = event.type === 'touchstart' ? event.touches[0].target : event.target;
  draggedImage = target.closest('.cloned-img');

  if (draggedImage) {
    event.preventDefault();
    isDragging = true;
    const rect = draggedImage.getBoundingClientRect();
    const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }
}

// Функция перетаскивания
function dragImage(event) {
  if (isDragging && draggedImage) {
    event.preventDefault();
    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
    const x = clientX - offsetX;
    const y = clientY - offsetY;
    draggedImage.style.left = `${x}px`;
    draggedImage.style.top = `${y}px`;
  }
}

// Функция окончания перетаскивания
function stopDragging() {
  isDragging = false;
  draggedImage = null;
  offsetX = 0;
  offsetY = 0;
}

// Получаем все изображения
const images = document.querySelectorAll('.item img');

// Обработчик события клика по изображению
images.forEach(img => {
  img.addEventListener('click', function(event) {
    // Проверяем, что у данного изображения нет копий
    const existingClones = document.querySelectorAll('.cloned-img');
    const hasDuplicate = Array.from(existingClones).some(clone => clone.src === this.src);
    if (hasDuplicate) {
      return; // Если уже есть копия с таким же источником, выходим из обработчика
    }

    // Создаем копию изображения
    const clonedImg = this.cloneNode(true);

    // Добавляем стили для увеличенной копии
    clonedImg.classList.add('cloned-img');

    // Размещаем копию по центру экрана
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const imgWidth = clonedImg.width;
    const imgHeight = clonedImg.height;
    const x = (pageWidth - imgWidth) / 20;
    const y = (pageHeight - imgHeight) / 20;
    clonedImg.style.left = `${x}px`;
    clonedImg.style.top = `${y}px`;

    // Добавляем обработчики событий для перетаскивания
    clonedImg.addEventListener('mousedown', startDragging);
    clonedImg.addEventListener('mousemove', dragImage);
    clonedImg.addEventListener('mouseup', stopDragging);
    clonedImg.addEventListener('touchstart', startDragging);
    clonedImg.addEventListener('touchmove', dragImage);
    clonedImg.addEventListener('touchend', stopDragging);

    // Добавляем обработчик события для закрытия копии
    clonedImg.addEventListener('click', function() {
      if (isDoubleTap) {
        this.remove();
      }
    });

    // Добавляем обработчик события двойного клика для закрытия копии
    clonedImg.addEventListener('dblclick', function() {
      if (!isDoubleTap) {
        this.remove();
      }
    });

    // Добавляем копию изображения в тело документа
    document.body.appendChild(clonedImg);
  });
});



//
