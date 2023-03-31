import HTMLAttributes from "../types/HTMLAttributes";
import createElement from "../utils/createElement.js";
import { setBaseClass } from "../utils/setBaseClass.js";

interface DataDisplayProps extends HTMLAttributes<HTMLTextAreaElement> {}

const baseClass = setBaseClass("textarea");

const DataDisplay = (props: DataDisplayProps): HTMLElement =>
  createElement("textarea", { className: baseClass, ...props });

export default DataDisplay;
