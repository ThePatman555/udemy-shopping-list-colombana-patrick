const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const filter = document.getElementById('filter');
const formButton = document.getElementById('add-btn')
let isEditMode = false;

function displayItems() {
    let items = getItemFromStorage();
    items.forEach(item => {
        addItemToDom(item)
    });
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    //Validate Input
    if (itemInput.value === '') {
        alert('Enter Value')
        return;
    }
    //Creating new li with item input
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        let newItem = itemInput.value
        addItemToDom(newItem)
        addItemToStorage(newItem)
    } else {
        let newItem = itemInput.value
        addItemToDom(newItem)
        addItemToStorage(newItem)
    }
    itemInput.value = ''
    checkUI();
}

function addItemToDom(item) {
    let li = document.createElement('li')
    li.innerHTML = `${item}<button id="remove-item" class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button>`
    itemList.appendChild(li);
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemFromStorage()
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target)
    };
}

function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formButton.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if (confirm('Are you sure you would like to delete?')) {
        item.remove();
    }

    removeItemFromStorage(item.textContent);
    checkUI();
};

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function clearAll(e) {
    e.preventDefault();
    if (confirm('Clear all items?')) {
        itemList.innerHTML = ''
        localStorage.clear();
    }
    checkUI();
}

function checkUI() {
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearButton.style.display = 'none'
        filter.style.display = 'none'
    } else {
        clearButton.style.display = 'block'
        filter.style.display = 'block';
    }

    formButton.innerHTML = '<i class = "fa-solid fa-plus"></i>   Add Item'
    formButton.style.backgroundColor = '#333'
    isEditMode = false;
}

function filterItem(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex'
        } else {
            item.style.display = 'none'
        }
    })
}

itemForm.addEventListener('submit', onAddItemSubmit); //event listener for form submission
clearButton.addEventListener('click', clearAll)
itemList.addEventListener('click', onClickItem)
filter.addEventListener('input', filterItem)
document.addEventListener('DOMContentLoaded', displayItems)
checkUI();

