export default function decodeHTMLEntities(string) {
  const textHtmlElement = document.createElement('textarea');
  textHtmlElement.innerHTML = string;
  return textHtmlElement.value;
}
