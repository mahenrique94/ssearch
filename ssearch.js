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
			showList(list);
		});
		ssData.addEventListener('focus', function() {
			this.parentNode.style.height = '300px';
			filter(ssData, list);
			showList(list);
		});
		ssData.addEventListener('keyup', function() {
			filter(this, list);
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
			let evt = new Event('change');
			let value = item.getAttribute('data-ss-value');
			let filter = item.parentNode.parentNode.querySelector('input.ss-search__filter');
			let select = item.parentNode.parentNode.parentNode.querySelector('select.ss-search');
			filter.value = item.textContent;
			select.value = value;
			select.dispatchEvent(evt);
			hideList(this.parentNode);
		});
		return item;
	}
	
}

// Filtrar os itens de acordo com o valor digitado no input
function filter(filter, list) {
	let regExp = new RegExp(filter.value, 'gi');
	let regExpMark = new RegExp('(([<])([\/]?[a-z]+([a-z0-9\s\=\"\-\_]*))([>]))', 'gim');
	if (filter.value != '') {
		list.children.forEach(item => {
			item.texContent = item.textContent.replace(regExpMark, '');
			let matches = item.textContent.match(regExp);
			if (matches != null && matches.length > 0) {
				item.style.display = 'block';
				matches.forEach(match => item.innerHTML = item.textContent.replace(match, `<mark class="ss-search__match">${match}</mark>`));
			} else {
				item.style.display = 'none'; 
			}
		});
	} else {
		list.children.forEach(item => {
			item.innerHTML = item.textContent.replace(regExpMark, '');
			item.style.display = 'block';
		});
	}
}

// Abrir a lista de itens para serem filtrados ou selecionados
function showList(list) {
	list.classList.remove('is-hide');
	list.classList.add('is-show');
	list.setAttribute('aria-hidden', 'false');
	list.setAttribute('aria-expanded', 'true');
}

// Fechar a lista de itens
function hideList(list) {
	list.classList.remove('is-show');
	list.classList.add('is-hide');
	list.setAttribute('aria-hidden', 'true');
	list.setAttribute('aria-expanded', 'false');
}

const selects = document.querySelectorAll('select.ss-search');
if (selects.length > 0) {
	selects.forEach(select => {
		let ssearch = new SSearch(select).init();
	});
}