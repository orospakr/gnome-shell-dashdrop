
const St = imports.gi.St;
const Main = imports.ui.main;

const Lang = imports.lang;

// gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell --method org.gnome.Shell.Extensions.ReloadExtension 'dashdrop@orospakr.ca'

const Tweener = imports.ui.tweener;

let text, button;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello(str) {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: str});
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.monitors[0];

    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', function() { _showHello("LOTE") });
}

function dragDropEnd(e) {
    _showHello("DOING" + e);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
    // Main.overview.connect('item-drag-end', dragDropEnd);
    var origDrag = Lang.bind(Main.overview._dash, Main.overview._dash._endDrag);
    Main.overview._dash._endDrag = function() {
        _showHello("YEA");
        origDrag();
    };
    
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
