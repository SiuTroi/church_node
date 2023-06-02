
const collabrTableContent = document.querySelector('.collabr-table-content');
const newsTableContent = document.querySelector('.news-table-content');

const btnShowCollabrContent = document.querySelector('.btn-show-collabr-content');
const btnHideCollabrContent = document.querySelector('.btn-hide-collabr-content');

const btnShowNewsContent = document.querySelector('.btn-show-news-content');
const btnHideNewsContent = document.querySelector('.btn-hide-news-content');

// Toggle Collabr Table Content
if(btnShowCollabrContent) {
  btnShowCollabrContent.addEventListener('click', () => {
    btnHideCollabrContent.classList.remove('d-none');
    btnShowCollabrContent.classList.add('d-none');
  
    collabrTableContent.classList.add('d-none');
  });
  btnHideCollabrContent.addEventListener('click', () => {
    btnShowCollabrContent.classList.remove('d-none');
    btnHideCollabrContent.classList.add('d-none');
  
    collabrTableContent.classList.remove('d-none');
  });
}

// Togle News Table Content
if(btnShowNewsContent) {
  btnShowNewsContent.addEventListener('click', () => {
    btnHideNewsContent.classList.remove('d-none');
    btnShowNewsContent.classList.add('d-none');
  
    newsTableContent.classList.add('d-none');
  });
  btnHideNewsContent.addEventListener('click', () => {
    btnShowNewsContent.classList.remove('d-none');
    btnHideNewsContent.classList.add('d-none');
  
    newsTableContent.classList.remove('d-none');
  });
}