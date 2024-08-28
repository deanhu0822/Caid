var _a;
import { Markup } from "@bokehjs/models/widgets/markup";
import { PanelMarkupView } from "./layout";
import { htmlDecode } from "./html";
export class PDFView extends PanelMarkupView {
    connect_signals() {
        super.connect_signals();
        const p = this.model.properties;
        const { text, width, height, embed, start_page } = p;
        this.on_change([text, width, height, embed, start_page], () => {
            this.update();
        });
    }
    render() {
        super.render();
        this.update();
    }
    update() {
        if (this.model.embed) {
            const blob = this.convert_base64_to_blob();
            const url = URL.createObjectURL(blob);
            const w = this.model.width || "100%";
            const h = this.model.height || "100%";
            this.container.innerHTML = `<embed src="${url}#page=${this.model.start_page}" type="application/pdf" width="${w}" height="${h}"></embed>`;
        }
        else {
            const html = htmlDecode(this.model.text);
            this.container.innerHTML = html || "";
        }
    }
    convert_base64_to_blob() {
        const byteCharacters = atob(this.model.text);
        const sliceSize = 512;
        var byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Uint8Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(byteNumbers);
        }
        return new Blob(byteArrays, { type: "application/pdf" });
    }
}
PDFView.__name__ = "PDFView";
export class PDF extends Markup {
    constructor(attrs) {
        super(attrs);
    }
}
_a = PDF;
PDF.__name__ = "PDF";
PDF.__module__ = "panel.models.markup";
(() => {
    _a.prototype.default_view = PDFView;
    _a.define(({ Number, Boolean }) => ({
        embed: [Boolean, true],
        start_page: [Number, 1],
    }));
})();
//# sourceMappingURL=pdf.js.map