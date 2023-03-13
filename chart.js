//File for chart visualization

//Making it possible to switch between table and char view:

let button = document.querySelectorAll(".viewMenu button");
let content_inside = document.querySelectorAll(".content_inside");

// console.log('hello world');

// console.log(Array.from(button));

Array.from(button).forEach(function (buttonArray, i) {
  buttonArray.addEventListener("click", function () {
    Array.from(button).forEach((buttonAll) =>
      buttonAll.classList.remove("button_active")
    );

    Array.from(content_inside).forEach((content_insideAll) =>
      content_insideAll.classList.remove("content_inside_active")
    );

    button[i].classList.add("button_active");

    content_inside[i].classList.add("content_inside_active");
  });
});

// if (!button[i].classList.contains('button_active')){
//   button[i].classList.add('button_active');
// }
