export default function appendChild(nameTag: string, html: string, target: HTMLDivElement) {
	const el = document.createElement(nameTag);
	el.innerHTML = html;
	target.appendChild(el);
	return el;
};