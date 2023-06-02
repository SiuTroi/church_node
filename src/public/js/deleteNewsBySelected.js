const newsSelectedList = document.querySelectorAll(".news-selected");
const btnTrash = document.querySelector(".btn-trash");
const listNewsForm = document.querySelector(".list-news-form");
const selectAllCheckbox = document.querySelector("#selectAll");

let arrayChecked = [];
newsSelectedList.forEach((item) => {
  item.addEventListener("change", function (event) {
    const isChecked = event.target.checked;
    const checkboxValue = event.target.value;

    if (isChecked) {
      arrayChecked.push(checkboxValue);
    } else {
      const index = arrayChecked.indexOf(checkboxValue);
      if (index > -1) {
        arrayChecked.splice(index, 1);
      }
    }
    if (arrayChecked.length > 1) {
      btnTrash.classList.remove("disabled");
    }
    if (arrayChecked.length <= 1) {
      btnTrash.classList.add("disabled");
      selectAllCheckbox.checked = false;
    }

    if (arrayChecked.length > 0) {
      arrayChecked.forEach((checkBox) => {
        console.log(checkBox);
      });
    }
  });
});

btnTrash.addEventListener("click", (event) => {
  event.preventDefault();
  if (confirm("Bạn chắc chắn muốn xóa các mục đã chọn?")) {
    listNewsForm.submit();
  }
});

selectAllCheckbox.addEventListener("change", (event) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    arrayChecked.splice(0, arrayChecked.length);
  }
  newsSelectedList.forEach((checkbox) => {
    checkbox.checked = isChecked;
    arrayChecked.push(checkbox.defaultValue);
  });
  if (!isChecked) {
    arrayChecked.splice(0, arrayChecked.length);
  }
  if (arrayChecked.length > 1) {
    btnTrash.classList.remove("disabled");
  }
  if (arrayChecked.length <= 1) {
    btnTrash.classList.add("disabled");
  }
  console.log(arrayChecked)
});
