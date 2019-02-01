import { DraggableElement } from "./draggable-element";

export abstract class BaseTreeItem extends DraggableElement {
    private static collapsedIconClass = "acd-icon-chevronRight";
    private static expandedIconClass = "acd-icon-chevronDown";

    private _isExpanded: boolean = true;
    private _isSelected: boolean = false;
    private _treeItemElement: HTMLElement;
    private _expandCollapseElement: HTMLElement;
    private _childContainerElement: HTMLElement;

    protected abstract getLabelText(): string;

    protected getIconClass(): string {
        return null;
    }

    protected getAdditionalText(): string {
        return null;
    }

    protected getAdditionalTextClass(): string {
        return "acd-tree-item-additionalText";
    }

    protected getIndentationLevelIncrement(): number {
        return 8;
    }

    protected getDragSourceElement(): HTMLElement {
        return this._treeItemElement;
    }

    protected selected() {
        // Do nothing in base implementation
    }

    protected internalRender(): HTMLElement {
        let rootElement = document.createElement("div");

        this._treeItemElement = document.createElement("div");
        this._treeItemElement.classList.add("acd-tree-item");
        this._treeItemElement.style.display = "flex";
        this._treeItemElement.style.alignItems = "center";
        this._treeItemElement.style.paddingLeft = this.getIndentationLevelIncrement() * (1 + this.level) + "px";
        this._treeItemElement.onclick = (e: MouseEvent) => {
            this._isExpanded = !this._isExpanded;

            this.updateLayout();

            e.cancelBubble = true;
            e.preventDefault();
        }

        this._expandCollapseElement = document.createElement("div");
        this._expandCollapseElement.classList.add("acd-tree-item-expandCollapseButton");
        this._expandCollapseElement.style.flex = "0 0 auto";
        this._expandCollapseElement.style.visibility = this.getChildCount() > 0 ? "visible" : "hidden";

        this._treeItemElement.appendChild(this._expandCollapseElement);

        let textElement = document.createElement("div");
        textElement.classList.add("acd-tree-item-text");
        textElement.style.flex = "1 1 auto";
        textElement.style.display = "flex";
        textElement.style.alignItems = "center";
        textElement.style.whiteSpace = "nowrap";
        textElement.style.textOverflow = "ellipsis";
        textElement.style.overflow = "hidden";
        textElement.onclick = (e: MouseEvent) => {
            this.selected();

            e.cancelBubble = true;
            e.preventDefault();
        }

        if (this.getIconClass()) {
            let iconElement = document.createElement("div");
            iconElement.classList.add("acd-icon", "acd-treeView-icon", this.getIconClass());

            textElement.appendChild(iconElement);
        }

        let labelSpan = document.createElement("span");
        labelSpan.classList.add("acd-tree-item-typeName");
        labelSpan.innerText = this.getLabelText();

        textElement.appendChild(labelSpan);

        let text = this.getAdditionalText();

        if (text && text != "") {
            let additionalTextSpan = document.createElement("span");
            additionalTextSpan.classList.add(this.getAdditionalTextClass());
            additionalTextSpan.innerText = " [" + text + "]";

            textElement.appendChild(additionalTextSpan);
        }

        this._treeItemElement.appendChild(textElement);

        rootElement.appendChild(this._treeItemElement);

        this._childContainerElement = document.createElement("div");

        for (let i = 0; i < this.getChildCount(); i++) {
            let renderedChildItem = this.getChildAt(i).render();

            this._childContainerElement.appendChild(renderedChildItem);
        }

        rootElement.appendChild(this._childContainerElement);

        this.updateLayout();

        return rootElement;
    }

    protected _level: number = 0;
    
    constructor() {
        super();
    }

    abstract getChildCount(): number;
    abstract getChildAt(index: number): BaseTreeItem;

    updateLayout() {
        if (this._isExpanded) {
            this._childContainerElement.classList.remove("acd-hidden");
            this._expandCollapseElement.classList.remove(BaseTreeItem.collapsedIconClass);
            this._expandCollapseElement.classList.add(BaseTreeItem.expandedIconClass);
        }
        else {
            this._childContainerElement.classList.add("acd-hidden");
            this._expandCollapseElement.classList.add(BaseTreeItem.collapsedIconClass);
            this._expandCollapseElement.classList.remove(BaseTreeItem.expandedIconClass);
        }
    }

    expand() {
        this._isExpanded = true;

        this.updateLayout();
    }

    get level(): number {
        return this._level;
    }

    get isSelected(): boolean {
        return this._isSelected;
    }

    set isSelected(value: boolean) {
        this._isSelected = value;

        if (this._isSelected) {
            this._treeItemElement.classList.add("selected");
        }
        else {
            this._treeItemElement.classList.remove("selected");
        }
    }
}