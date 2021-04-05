const selectCount = document.querySelector('.dropdown-select-count');
const selectName = document.querySelector('.dropdown-select-name');
const listName = document.querySelector('.dropdown__list-name');
const listCount = document.querySelector('.dropdown__list-count');

listName.onclick = function(event) {
  let target = event.target; 

  if (target.tagName != 'LI') return;

  selectName.textContent = target.textContent;
};
selectName.onclick = function(event) {
  listName.classList.toggle('dropdown__list-onclick');
};
listCount.onclick = function(event) {
  let target = event.target; 

  if (target.tagName != 'LI') return;

  selectCount.textContent = target.textContent;
};
selectCount.onclick = function(event) {
  listCount.classList.toggle('dropdown__list-onclick');
};

const minus = document.querySelector('.button-minus');
const plus = document.querySelector('.button-plus');
const count = document.querySelector('.button-count');

minus.onclick = function() {
  count.innerHTML--;
}
plus.onclick = function() {
  count.innerHTML++;
}




