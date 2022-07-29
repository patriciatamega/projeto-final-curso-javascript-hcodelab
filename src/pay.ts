import { HTMLInputField } from "./types/HTMLInputField";
import IMask from "imask";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import formatCurrency from "./functions/formatCurrency";


const pagePay = document.querySelector("section.page") as HTMLElement;

if (pagePay) {
	const form = pagePay.querySelector("form") as HTMLFormElement;
	const number = form.querySelector("#number") as HTMLInputField;
	const validate = form.querySelector("#validate") as HTMLInputField;
	const code = form.querySelector("#code") as HTMLInputField;
	const name = form.querySelector("#name") as HTMLInputField;
	const bank = form.querySelector("#bank") as HTMLInputField;
	const installments = form.querySelector("#installments") as HTMLDivElement;




	const orderlocalStorage = localStorage.getItem("order");

	if (orderlocalStorage) {
		const buttonPay = document.querySelector("#payment") as HTMLButtonElement;

		buttonPay.addEventListener("click", () => {

		const parseOrder = JSON.parse(orderlocalStorage);

		const user = parseOrder.user;
		const order = parseOrder.order;
		const date = parseOrder.date;
		const itens = parseOrder.itens;
		const total = parseOrder.total;

		const calcTotal = total / 2;
		installments.innerHTML = "";

		installments.innerHTML = `
									<option value="1">1 parcela de ${formatCurrency(total)} (${formatCurrency(total)})</option>
									<option value="2">2 parcelas de ${formatCurrency(calcTotal)} (${formatCurrency(total)})</option>
								`;

		

			const db = getFirestore();

			const colletionsOrders = collection(db, 'orders');
			addDoc(colletionsOrders, {
				user,
				order,
				date,
				itens,
				total
			})

			localStorage.clear();
			

		})

	}

	number.addEventListener("keyup", (e) => {
		number.value.replaceAll(" ", "");
	});

	IMask(number, {
		mask: "0000 0000 0000 0000",
	});

	const year = new Date().getFullYear();

	IMask(validate, {
		mask: "MM/YY",
		blocks: {
			YY: {
				mask: IMask.MaskedRange,
				from: year.toString().substring(2, 4),
				to: (year + 10).toString().substring(2, 4),
			},
			MM: {
				mask: IMask.MaskedRange,
				from: 1,
				to: 12,
			},
		},
	});

	IMask(code, {
		mask: "000[0]",
	});
}
