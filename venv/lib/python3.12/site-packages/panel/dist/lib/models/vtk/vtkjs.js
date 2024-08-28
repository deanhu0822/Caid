var _a;
import { AbstractVTKView, AbstractVTKPlot } from "./vtklayout";
import { vtkns } from "./util";
export class VTKJSPlotView extends AbstractVTKView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.data.change, () => {
            this.invalidate_render();
        });
    }
    render() {
        super.render();
        this._create_orientation_widget();
        this._set_axes();
    }
    invalidate_render() {
        this._vtk_renwin = null;
        super.invalidate_render();
    }
    init_vtk_renwin() {
        this._vtk_renwin = vtkns.FullScreenRenderWindow.newInstance({
            rootContainer: this._vtk_container,
            container: this._vtk_container,
        });
    }
    plot() {
        if (this.model.data == null) {
            this._vtk_renwin.getRenderWindow().render();
            return;
        }
        const dataAccessHelper = vtkns.DataAccessHelper.get("zip", {
            zipContent: atob(this.model.data),
            callback: (_zip) => {
                const sceneImporter = vtkns.HttpSceneLoader.newInstance({
                    renderer: this._vtk_renwin.getRenderer(),
                    dataAccessHelper,
                });
                const fn = window.vtk.macro.debounce(() => {
                    setTimeout(() => {
                        if (this._axes == null && this.model.axes)
                            this._set_axes();
                        this._set_camera_state();
                        this._get_camera_state();
                        this._vtk_renwin.getRenderWindow().render();
                    }, 100);
                }, 100);
                sceneImporter.setUrl("index.json");
                sceneImporter.onReady(fn);
            },
        });
    }
}
VTKJSPlotView.__name__ = "VTKJSPlotView";
export class VTKJSPlot extends AbstractVTKPlot {
}
_a = VTKJSPlot;
VTKJSPlot.__name__ = "VTKJSPlot";
(() => {
    _a.prototype.default_view = VTKJSPlotView;
    _a.define(({ Boolean, Nullable, String }) => ({
        data: [Nullable(String)],
        enable_keybindings: [Boolean, false],
    }));
})();
//# sourceMappingURL=vtkjs.js.map