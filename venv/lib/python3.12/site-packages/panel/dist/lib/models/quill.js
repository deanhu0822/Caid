var _a;
import { div } from "@bokehjs/core/dom";
import { HTMLBox, HTMLBoxView } from "./layout";
export class QuillInputView extends HTMLBoxView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.disabled.change, () => this.quill.enable(!this.model.disabled));
        this.connect(this.model.properties.visible.change, () => {
            if (this.model.visible)
                this.container.style.visibility = 'visible';
        });
        this.connect(this.model.properties.text.change, () => {
            if (this._editing)
                return;
            this._editing = true;
            this.quill.enable(false);
            this.quill.setContents([]);
            this.quill.clipboard.dangerouslyPasteHTML(this.model.text);
            this.quill.enable(!this.model.disabled);
            this._editing = false;
        });
        const { mode, toolbar, placeholder } = this.model.properties;
        this.on_change([placeholder], () => {
            this.quill.root.setAttribute('data-placeholder', this.model.placeholder);
        });
        this.on_change([mode, toolbar], () => {
            this.render();
            this._layout_toolbar();
        });
    }
    _layout_toolbar() {
        if (this._toolbar == null) {
            this.el.style.removeProperty('padding-top');
        }
        else {
            const height = this._toolbar.getBoundingClientRect().height + 1;
            this.el.style.paddingTop = height + "px";
            this._toolbar.style.marginTop = -height + "px";
        }
    }
    render() {
        super.render();
        this.container = div({ style: "visibility: hidden;" });
        this.shadow_el.appendChild(this.container);
        const theme = (this.model.mode === 'bubble') ? 'bubble' : 'snow';
        this.watch_stylesheets();
        this.quill = new window.Quill(this.container, {
            modules: {
                toolbar: this.model.toolbar
            },
            readOnly: true,
            placeholder: this.model.placeholder,
            theme: theme
        });
        // Apply ShadowDOM patch found at:
        // https://github.com/quilljs/quill/issues/2961#issuecomment-1775999845
        const hasShadowRootSelection = !!(document.createElement('div').attachShadow({ mode: 'open' }).getSelection);
        // Each browser engine has a different implementation for retrieving the Range
        const getNativeRange = (rootNode) => {
            try {
                if (hasShadowRootSelection) {
                    // In Chromium, the shadow root has a getSelection function which returns the range
                    return rootNode.getSelection().getRangeAt(0);
                }
                else {
                    const selection = window.getSelection();
                    if (selection.getComposedRanges) {
                        // Webkit range retrieval is done with getComposedRanges (see: https://bugs.webkit.org/show_bug.cgi?id=163921)
                        return selection.getComposedRanges(rootNode)[0];
                    }
                    else {
                        // Gecko implements the range API properly in Native Shadow: https://developer.mozilla.org/en-US/docs/Web/API/Selection/getRangeAt
                        return selection.getRangeAt(0);
                    }
                }
            }
            catch {
                return null;
            }
        };
        /**
         * Original implementation uses document.active element which does not work in Native Shadow.
         * Replace document.activeElement with shadowRoot.activeElement
         **/
        this.quill.selection.hasFocus = () => {
            const rootNode = this.quill.root.getRootNode();
            return rootNode.activeElement === this.quill.root;
        };
        /**
         * Original implementation uses document.getSelection which does not work in Native Shadow.
         * Replace document.getSelection with shadow dom equivalent (different for each browser)
         **/
        this.quill.selection.getNativeRange = () => {
            const rootNode = this.quill.root.getRootNode();
            const nativeRange = getNativeRange(rootNode);
            return !!nativeRange ? this.quill.selection.normalizeNative(nativeRange) : null;
        };
        /**
         * Original implementation relies on Selection.addRange to programmatically set the range, which does not work
         * in Webkit with Native Shadow. Selection.addRange works fine in Chromium and Gecko.
         **/
        this.quill.selection.setNativeRange = (startNode, startOffset) => {
            var endNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : startNode;
            var endOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : startOffset;
            var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
            if (startNode != null && (this.quill.selection.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
                return;
            }
            var selection = document.getSelection();
            if (selection == null)
                return;
            if (startNode != null) {
                if (!this.quill.selection.hasFocus())
                    this.quill.selection.root.focus();
                var native = (this.quill.selection.getNativeRange() || {}).native;
                if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
                    if (startNode.tagName == "BR") {
                        startOffset = [].indexOf.call(startNode.parentNode.childNodes, startNode);
                        startNode = startNode.parentNode;
                    }
                    if (endNode.tagName == "BR") {
                        endOffset = [].indexOf.call(endNode.parentNode.childNodes, endNode);
                        endNode = endNode.parentNode;
                    }
                    selection.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
                }
            }
            else {
                selection.removeAllRanges();
                this.quill.selection.root.blur();
                document.body.focus();
            }
        };
        this._editor = this.shadow_el.querySelector('.ql-editor');
        this._toolbar = this.shadow_el.querySelector('.ql-toolbar');
        const delta = this.quill.clipboard.convert(this.model.text);
        this.quill.setContents(delta);
        this.quill.on('text-change', () => {
            if (this._editing)
                return;
            this._editing = true;
            this.model.text = this._editor.innerHTML;
            this._editing = false;
        });
        if (!this.model.disabled)
            this.quill.enable(!this.model.disabled);
        document.addEventListener("selectionchange", (..._args) => {
            // Update selection and some other properties
            this.quill.selection.update();
        });
    }
    style_redraw() {
        if (this.model.visible)
            this.container.style.visibility = 'visible';
        const delta = this.quill.clipboard.convert(this.model.text);
        this.quill.setContents(delta);
        this.invalidate_layout();
    }
    after_layout() {
        super.after_layout();
        this._layout_toolbar();
    }
}
QuillInputView.__name__ = "QuillInputView";
export class QuillInput extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = QuillInput;
QuillInput.__name__ = "QuillInput";
QuillInput.__module__ = "panel.models.quill";
(() => {
    _a.prototype.default_view = QuillInputView;
    _a.define(({ Any, String }) => ({
        mode: [String, 'toolbar'],
        placeholder: [String, ''],
        text: [String, ''],
        toolbar: [Any, null],
    }));
    _a.override({
        height: 300
    });
})();
//# sourceMappingURL=quill.js.map