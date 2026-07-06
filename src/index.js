import "./styles.css";
import { DOMcontroller } from "./DOMcontroller.js";
console.log("Hello");
function loadController() {
  const controller = new DOMcontroller();
  controller.onClickFunctions();
}
loadController();
