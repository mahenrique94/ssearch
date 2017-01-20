NodeList.prototype.forEach = Array.prototype.forEach; 
HTMLCollection.prototype.forEach = Array.prototype.forEach;

/** @auth Matheus Castiglioni
 *  Component para realizar buscas e filtros em selects
 */
class SSearch {
	
	constructor(select) {
		this.list = null;
		this.data = null;
		this.icon = null;
		this.select = select;
	}
	
	init() {
		this.select.parentNode.appendChild(this.create());
	}
	
	// Criando a div que irá agrupar todos os components do ss
	create() {
		const ssComponents = document.createElement('DIV');
		this.list = this.createList();
		ssComponents.classList.add('ss-search__components');
		ssComponents.appendChild(this.createFilter());
		ssComponents.appendChild(this.createIcon());
		ssComponents.appendChild(this.list);
		return ssComponents;
	}
	
	// Criando o input responsável por filtrar ou buscar as informações
	createFilter() {
		const list = this.list;
		const ssData = document.createElement('INPUT');
		ssData.classList.add('ss-search__data', 'ss-search__filter');
		ssData.setAttribute('type', 'text');
		ssData.setAttribute('aria-controls', `ssSearch__${this.select.id}`);
		ssData.addEventListener('click', function() {
			this.parentNode.style.height = '300px';
			filter(ssData, list);
			showElement(list);
		});
		ssData.addEventListener('focus', function() {
			this.parentNode.style.height = '300px';
			filter(ssData, list);
			showElement(list);
		});
		ssData.addEventListener('keyup', function(event) {
			if (event.keyCode === 38 || event.keyCode === 40) {
				// seta para cima
				if (event.keyCode === 38)
					previusItem(list);
				// seta para baixo
				if (event.keyCode === 40)
					nextItem(list);
			} else {
				filter(this, list);
			}
		});
		ssData.addEventListener('keypress', function(event) {
			// enter
			if (event.keyCode === 13) {
				event.preventDefault();
				chooseItem(list);
			}
		});
		this.data = ssData;
		return ssData;
	}
	
	createIcon() {
		const icon = document.createElement('SPAN');
		icon.classList.add('icon-angle-down', 'ss-search__icon');
		this.icon = icon;
		return icon;
	}
	
	// Criando a lista de opções para serem filtradas
	createList() {
		const createItem = this.createItem;
		const select = this.select;
		const list = document.createElement('UL');
		list.classList.add('ss-search__list', 'is-hide');
		list.setAttribute('aria-hidden', 'true');
		list.setAttribute('aria-expanded', 'false');
		setTimeout(function() {
			select.options.forEach(option => {
				list.appendChild(createItem(option.textContent, option.value));
			});
		}, 1000);
		return list;
	}
	
	// Criando cada item da lista
	createItem(text, value) {
		const item = document.createElement('LI');
		item.classList.add('ss-search__item');
		item.textContent = text;
		item.setAttribute('data-ss-value', value);
		item.addEventListener('click', function() {
			selectedItem(this);
		});
		return item;
	}
	
}

// Selecionando o item e definindo ele como valor do select
function selectedItem(item) {
	let evt = new Event('change');
	let value = item.getAttribute('data-ss-value');
	let filter = item.parentNode.parentNode.querySelector('input.ss-search__filter');
	let select = item.parentNode.parentNode.parentNode.querySelector('select.ss-search');
	filter.value = item.textContent;
	select.value = value;
	select.dispatchEvent(evt);
	hideElement(item.parentNode);
}

// Filtrar os itens de acordo com o valor digitado no input
function filter(filter, list) {
	let regExp = new RegExp(filter.value, 'gi');
	let regExpMark = new RegExp('(([<])([\/]?[a-z]+([a-z0-9\s\=\"\-\_]*))([>]))', 'gim');
	if (filter.value != '') {
		removeHovered(list);
		list.children.forEach(item => {
			item.texContent = item.textContent.replace(regExpMark, '');
			let matches = item.textContent.match(regExp);
			if (matches != null && matches.length > 0) {
				showElement(item);
				item.style.display = 'block';
				matches.forEach(match => item.innerHTML = item.textContent.replace(match, `<mark class="ss-search__match">${match}</mark>`));
			} else {
				item.style.display = 'none'; 
				hideElement(item);
			}
		});
	} else {
		list.children.forEach(item => {
			item.innerHTML = item.textContent.replace(regExpMark, '');
			showElement(item);
			item.style.display = 'block';
		});
	}
}

function showElement(element) {
	element.classList.remove('is-hide');
	element.classList.add('is-show');
	element.setAttribute('aria-hidden', 'false');
	element.setAttribute('aria-expanded', 'true');
}

function hideElement(element) {
	element.classList.remove('is-show');
	element.classList.add('is-hide');
	element.setAttribute('aria-hidden', 'true');
	element.setAttribute('aria-expanded', 'false');
}

// Ir para o item anterior da lista com as setas do teclado
function previusItem(list) {
	if (hasItemHovered(list)) {
		const hover = findHovered(list);
		hover.classList.remove('is-hovered');
		hover.previousSibling.classList.add('is-hovered');
	}
}

// Ir para o próximo item da lista com as setas do teclado
function nextItem(list) {
	if (hasItemHovered(list)) {
		const hover = findHovered(list);
		hover.classList.remove('is-hovered');
		hover.nextSibling.classList.add('is-hovered');
	} else {
		const item = list.querySelector('.ss-search__item.is-show');
		if (item.textContent != '') 
			item.classList.add('is-hovered');
		else
			item.nextSibling.classList.add('is-hovered');
	}
}

// Selecionar item na lsita com o enter
function chooseItem(list) {
	const hover = findHovered(list);
	selectedItem(hover);
}

function findHovered(list) {
	return list.querySelector('.is-hovered');
}

function hasItemHovered(list) {
	return findHovered(list) != undefined;
}

function removeHovered(list) {
	let hover = findHovered(list);
	if (hover != undefined)
		hover.classList.remove('is-hovered');
}

const selects = document.querySelectorAll('select.ss-search');
if (selects.length > 0) {
	selects.forEach(select => {
		let ssearch = new SSearch(select).init();
	});
}