import { Ingredient } from "../types/ingredient";
import { Breads } from "../types/breads";
import { AnyObject } from "../types/anyObject";

let breads: Breads[] = [];
let ingredients: Ingredient[] = [];

export default function () {
	let total: number;
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
	total = mergePrices.reduce((a: number, b: number) => a + b, 0);
	console.log(`Dentro da função ${total}`);

	return total;
}
