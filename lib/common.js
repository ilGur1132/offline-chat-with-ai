var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    const context = config.interface.context;
    const url = app.interface.path + '?' + context;
    /*  */
    app.interface.id = '';
    app.button.set.popup(context === "popup" ? url : '');
    app.button.set.sidebar(context === "sidebar" ? url : '');
    /*  */
    app.contextmenu.create({
      "id": "win",
      "type": "radio",
      "title": "Open in win",
      "contexts": ["action"],
      "checked": context === "win"
    }, app.error);
    /*  */
    app.contextmenu.create({
      "id": "popup",
      "type": "radio",
      "contexts": ["action"],
      "title": "Open in popup",
      "checked": context === "popup"
    }, app.error);
    /*  */
    app.contextmenu.create({
      "id": "sidebar", 
      "type": "radio", 
      "contexts": ["action"],
      "title": "Open in sidebar",
      "checked": context === "sidebar"
    }, app.error);
    /*  */
    app.contextmenu.create({
      "id": "tab",
      "type": "radio",
      "contexts": ["action"],
      "title": "Open in a new tab",
      "checked": context === "tab"
    }, app.error);
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "removed": function (e) {
      if (e === app.interface.id) {
        app.interface.id = '';
      }
    },
    "close": function () {
      app.tab.query.active(function (tab) {
        if (config.interface.context === "tab") {
          app.tab.remove(tab.id);
        }
        /*  */
        if (config.interface.context === "win") {
          app.window.remove(app.interface.id);
        }
      });
    },
    "contextmenu": function (e) {
      if (e) {
        app.button.set.popup('');
        app.button.set.sidebar('');
        app.interface.close(config.interface.context);
        /*  */
        config.interface.context = e.menuItemId;
        const url = app.interface.path + '?' + config.interface.context;
        /*  */
        if (config.interface.context === "popup") {
          app.button.set.popup(url);
        }
        /*  */
        if (config.interface.context === "sidebar") {
          app.button.set.sidebar(url);
        }
      }
    },
    "button": function () {
      const context = config.interface.context;
      const url = app.interface.path + '?' + context;
      /*  */
      if (context === "popup") {
        app.button.set.popup(url);
        app.button.set.sidebar('');
      } else if (context === "sidebar") {
        app.button.set.popup('');
        app.button.set.sidebar(url);
      } else {
        app.button.set.popup('');
        app.button.set.sidebar('');
        /*  */
        if (app.interface.id) {
          if (context === "tab") {
            app.tab.get(app.interface.id, function (tab) {
              if (tab) {
                app.tab.update(app.interface.id, {"active": true});
              } else {
                app.tab.open(url, undefined, true, function (e) {
                  app.interface.id = e.id;
                });
              }
            });
          }
          /*  */
          if (context === "win") {
            app.window.get(app.interface.id, function (win) {
              if (win) {
                app.window.update(app.interface.id, {"focused": true});
              } else {
                app.interface.create(url, function (e) {
                  app.interface.id = e.id;
                });
              }
            });
          }
        } else {
          if (context === "tab") {
            app.tab.open(url, undefined, true, function (e) {
              app.interface.id = e.id;
            });
          }
          /*  */
          if (context === "win") {
            app.interface.create(url, function (e) {
              app.interface.id = e.id;
            });
          }
        }
      }
    }
  }
};

app.interface.receive("support", function () {app.tab.open(app.homepage())});
app.interface.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});

app.hotkey.on.pressed(core.action.button);
app.button.on.clicked(core.action.button);
app.window.on.removed(core.action.removed);
app.contextmenu.on.clicked(core.action.contextmenu);

app.on.startup(core.start);
app.on.installed(core.install);
app.on.storage(core.action.storage);
