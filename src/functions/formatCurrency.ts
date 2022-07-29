export default function (value: Number) {
	return Number(value).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}
