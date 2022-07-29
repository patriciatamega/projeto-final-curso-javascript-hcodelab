import { Ingredient } from "./types/ingredient";
import { Breads } from "./types/breads";
import formatCurrency from "./functions/formatCurrency";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import { AnyObject } from "./types/anyObject";
import { Order } from "./types/order";

const mainPage = document.querySelector(".mainBurger");

if (mainPage) {
	const db = getFirestore();
	let breads: Breads[] = [];
	let ingredients: Ingredient[] = [];
	let breadSelected: number;
	let ingredientSelected: number[] = [];
	let itensCart: object[] = [];
	let cart = {} as AnyObject;
	let totalOrder: number;

	const addCart = mainPage.querySelector(
		"section footer button"
	) as HTMLButtonElement;
	const buttonPagar = mainPage.querySelector("#pagar") as HTMLButtonElement;

	buttonPagar.addEventListener("click", (e) => {
		e.preventDefault();
		location.pathname = "pay.html";
	});

	const ulBreads = mainPage.querySelector(".bread ul") as HTMLDivElement;
	ulBreads.innerHTML = "";

	const breadSelectedChange = (e: Event) => {
		const input = e.target as HTMLInputElement;

		if (input.checked) {
			let breadId = Number(input.value);
			breadSelected = Number(breadId);
		}
	};

	const calcTotal = () => {
		const subtotal = mainPage.querySelector(".price span") as HTMLSpanElement;
		const itensCard = localStorage.getItem("itensCart");
		const mergePrices: number[] = [];
		if (itensCard) {
			const itensCartParse = JSON.parse(itensCard);
			itensCartParse.forEach((item: AnyObject) => {
				let breadsPrice = breads.find(
					(bread) => bread.id === item.bread
				)?.price;

				let ingredientItem = item.ingredients
					.map((ingredient: number) =>
						ingredients.find(
							(ingredientItem) => ingredientItem.id === ingredient
						)
					)
					.map((ingredient: { price: Ingredient }) => ingredient?.price)
					.reduce((a: number, b: number) => a + b, 0);

				if (breadsPrice) {
					mergePrices.push(breadsPrice, ingredientItem);
				}
			});
		}
		const total = mergePrices.reduce((a: number, b: number) => a + b, 0);
		totalOrder = total;
		subtotal.innerHTML = formatCurrency(total);
	};

	const payButton = mainPage.querySelector(
		"aside footer button"
	) as HTMLButtonElement;

	payButton.addEventListener("click", () => {
		const getCart = localStorage.getItem("cart");
		const getItens = localStorage.getItem("itensCart");
		if (getCart && getItens) {
			const parceCart = JSON.parse(getCart);
			const parceItens = JSON.parse(getItens);

			const order: Order = {
				order: parceCart.order,
				user: parceCart.user,
				itens: parceItens,
				date: new Date(),
				total: totalOrder,
			};

			const orderParce = JSON.stringify(order);

			localStorage.setItem("order", orderParce);
		}
	});

	const removeItemCard = (index: number) => {
		const itensCard = localStorage.getItem("itensCart");
		const itensCartParse = JSON.parse(`${itensCard}`);

		if (index > -1) {
			itensCartParse.splice(index, 1);
		}

		localStorage.setItem("itensCart", JSON.stringify(itensCartParse));
		renderCart();
	};

	const renderCart = () => {
		const ulCart = mainPage.querySelector("#cart ul") as HTMLUListElement;
		let count = 0;
		ulCart.innerHTML = "";

		const countBurger = mainPage.querySelector(".countBurger") as HTMLElement;

		const getItensStorage = localStorage.getItem("itensCart");
		const itensCartStorage = JSON.parse(`${getItensStorage}`);

		if (itensCartStorage) {
			if (itensCartStorage.length < 1) {
				countBurger.innerHTML = "0 Hambúrgueres";
			} else if (itensCartStorage.length === 1) {
				countBurger.innerHTML = "1 Hambúrguer";
			} else {
				countBurger.innerHTML = "";
				countBurger.innerHTML = `${itensCartStorage.length} Hambúrgueres`;
			}
		}

		if (itensCartStorage) {
			itensCartStorage.forEach((item: AnyObject, index: number) => {
				const li = document.createElement("li");

				const breadItem = breads.find(
					(bread) => bread.id === item["bread"]
				);

				const ingredientItem = item.ingredients
					.map((ingredient: number) =>
						ingredients.find(
							(ingredientItem) => ingredientItem.id === ingredient
						)
					)
					.map((ingredient: { price: Ingredient }) => ingredient.price)
					.reduce((a: number, b: number) => a + b, 0);

				const breadPrice = Number(breadItem?.["price"]);
				const ingredientsPrice = ingredientItem;

				li.innerHTML = `
					<div id="item">${`Hamburger ${count + 1}`}</div>
						<div id="price">${formatCurrency(breadPrice + ingredientsPrice)}</div>
						<button type="button" aria-label="Remover Hamburguer 1">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
						</svg>
					</button>
				`;

				const svg = li.querySelector("svg") as SVGSVGElement;
				svg.addEventListener("click", () => {
					removeItemCard(index);
				});

				ulCart.appendChild(li);

				count++;
			});
		}

		calcTotal();
	};

	addCart.addEventListener("click", () => {
		setBurger();
		renderCart();
		ingredientSelected = [];
	});
	const button = mainPage.querySelector(
		"#salvarHamburguer"
	) as HTMLButtonElement;

	const renderBreads = () => {
		ulBreads.innerHTML = "";
		breads.forEach((item) => {
			const li = document.createElement("li") as HTMLLIElement;
			li.innerHTML = `
				<label>
					<input type="radio" name="item" value="${item.id}"/>
					<span></span>
					<h3>${item.name}</h3>
					<div>${formatCurrency(item.price)}</div>
				</label>
			`;

			const liInput = li.querySelector("input") as HTMLInputElement;
			liInput.addEventListener("change", breadSelectedChange);

			ulBreads.appendChild(li);
			liInput.addEventListener("click", () => {
				button.disabled = false;
				button.style.backgroundColor = "#4159e9";
			});
			button.addEventListener("click", (e) => {
				e.preventDefault();
				liInput.checked = false;
				button.disabled = true;
				button.style.backgroundColor = "grey";
			});
		});
	};

	const ingredientSelectedChange = (e: Event) => {
		const input = e.target as HTMLInputElement;

		if (input.checked) {
			ingredientSelected.push(Number(input.value));
		} else {
			ingredientSelected = ingredientSelected.filter(
				(id) => id !== Number(input.value)
			);
		}
	};

	const ulIngredients = mainPage.querySelector(
		".ingredient ul"
	) as HTMLDivElement;
	ulIngredients.innerHTML = "";
	const renderIngredients = () => {
		ulIngredients.innerHTML = "";
		ingredients.forEach((item) => {
			const li = document.createElement("li");
			li.innerHTML = `
				<label>
				<input type="checkbox" name="item" value="${item.id}" />
				<span></span>
				<h3>${item.name}</h3>
				<div>${formatCurrency(item.price)}</div>
				</label>
			`;

			const liInput = li.querySelector("input") as HTMLInputElement;
			liInput.addEventListener("change", ingredientSelectedChange);
			ulIngredients.appendChild(li);
			button.addEventListener("click", (e) => {
				e.preventDefault();
				liInput.checked = false;
			});
		});
	};

	const setBurger = () => {
		const getItens = localStorage.getItem("itensCart");
		const includeItem = () => {
			const getItens = localStorage.getItem("itensCart");
			const parceItens = JSON.parse(`${getItens}`);
			const burger = {
				bread: breadSelected,
				ingredients: ingredientSelected,
			};

			parceItens.push(burger);
			localStorage.setItem("itensCart", JSON.stringify(parceItens));
		};

		if (getItens === null) {
			localStorage.setItem("itensCart", JSON.stringify(itensCart));
			includeItem();
		} else {
			includeItem();
		}
	};

	onSnapshot(collection(db, "breads"), (collection) => {
		breads = [];

		collection.forEach((doc) => {
			breads.push(doc.data() as Breads);
		});

		renderBreads();
	});

	onSnapshot(collection(db, "Ingredientes"), (collection) => {
		ingredients = [];

		collection.forEach((doc) => {
			ingredients.push(doc.data() as Ingredient);
		});

		renderIngredients();
		renderCart();
	});

	let uid = sessionStorage.getItem("uid");
	let numPed = new Date().getTime();
	window.addEventListener("load", () => {
		cart = {
			user: uid,
			order: numPed,
		};

		localStorage.setItem("cart", JSON.stringify(cart));
	});
}
