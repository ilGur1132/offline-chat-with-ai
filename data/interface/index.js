var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "send": function (id, data) {
    if (id) {
      if (context !== "webapp") {
        chrome.runtime.sendMessage({
          "method": id,
          "data": data,
          "path": "interface-to-background"
        }, function () {
          return chrome.runtime.lastError;
        });
      }
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "port": background.port.name,
          "path": "interface-to-background"
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (let id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-interface") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};

var config = {
  "log": false,
  "addon": {
    "homepage": function () {
      return chrome.runtime.getManifest().homepage_url;
    }
  },
  "elements": {
    "footer": {},
    "scroll": {},
    "button": {},
    "toggle": {},
    "options": {},
    "content": {}
  },
  "engine": {
    "markdown": null,
    "ai": {
      "defaults": {},
      "session": {
        "chats": {},
        "class": {},
        "current": null
      }
    }
  },
  "resize": {
    "timeout": null,
    "method": function () {
      if (config.port.name === "win") {
        if (config.resize.timeout) window.clearTimeout(config.resize.timeout);
        config.resize.timeout = window.setTimeout(async function () {
          const current = await chrome.windows.getCurrent();
          /*  */
          config.storage.write("interface.size", {
            "top": current.top,
            "left": current.left,
            "width": current.width,
            "height": current.height
          });
        }, 500);
      }
    }
  },
  "port": {
    "name": '',
    "connect": function () {
      config.port.name = "webapp";
      const context = document.documentElement.getAttribute("context");
      /*  */
      if (chrome.runtime) {
        if (chrome.runtime.connect) {
          if (context !== config.port.name) {
            if (document.location.search === "?tab") config.port.name = "tab";
            if (document.location.search === "?win") config.port.name = "win";
            if (document.location.search === "?popup") config.port.name = "popup";
            if (document.location.search === "?sidebar") config.port.name = "sidebar";
            /*  */
            if (config.port.name === "popup") {
              document.documentElement.style.width = "780px";
              document.documentElement.style.height = "590px";
            }
            /*  */
            background.connect(chrome.runtime.connect({"name": config.port.name}));
          }
        }
      }
      /*  */
      document.documentElement.setAttribute("context", config.port.name);
    }
  },
  "storage": {
    "local": {},
    "read": function (id) {
      return config.storage.local[id];
    },
    "load": function (callback) {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    },
    "clear": function (callback) {
      chrome.storage.local.clear(function () {
        config.storage.local = {};
        if (callback) {
          callback();
        }
      });
    },
    "write": function (id, data, callback) {
      if (id) {
        if (data !== '' && data !== null && data !== undefined) {
          let tmp = {};
          tmp[id] = data;
          config.storage.local[id] = data;
          chrome.storage.local.set(tmp, callback);
        } else {
          delete config.storage.local[id];
          chrome.storage.local.remove(id, callback);
        }
      }
    }
  },
  "load": function () {
    config.elements.print = document.querySelector("#print");
    config.elements.reload = document.querySelector("#reload");
    config.elements.expand = document.querySelector("#expand");
    config.elements.support = document.querySelector("#support");
    config.elements.session = document.querySelector("#session");
    config.elements.options.max = document.querySelector("#max");
    config.elements.options.topk = document.querySelector("#topk");
    config.elements.options.font = document.querySelector("#font");
    config.elements.collapse = document.querySelector("#collapse");
    config.elements.donation = document.querySelector("#donation");
    config.elements.options.fold = document.querySelector("#fold");
    config.elements.options.dark = document.querySelector("#dark");
    config.elements.container = document.querySelector(".container");
    config.elements.chat = document.querySelector(".container .chat");
    config.elements.scroll.top = document.querySelector(".scroll .top");
    config.elements.footer.container = document.querySelector(".footer");
    config.elements.footer.input = document.querySelector(".footer .input");
    config.elements.options.streaming = document.querySelector("#streaming");
    config.elements.footer.submit = document.querySelector(".footer .submit");
    config.elements.scroll.bottom = document.querySelector(".scroll .bottom");
    config.elements.sessions = document.querySelector(".container .sessions");
    config.elements.settings = document.querySelector(".container .settings");
    config.elements.toggle.sessions = document.querySelector(".toggle-sessions");
    config.elements.toggle.settings = document.querySelector(".toggle-settings");
    config.elements.options.temperature = document.querySelector("#temperature");
    config.elements.footer.textarea = document.querySelector(".footer .input textarea");
    config.elements.clear = document.querySelector(".container .sessions .header .clear");
    config.elements.content.sessions = document.querySelector(".container .sessions .content");
    config.elements.content.settings = document.querySelector(".container .settings .content");
    config.elements.button.sessions = document.querySelector(".toggle-sessions #toggle-sessions");
    config.elements.button.settings = document.querySelector(".toggle-settings #toggle-settings");
    /*  */
    config.elements.chat.addEventListener("wheel", config.interface.listeners.chat, false);
    config.elements.print.addEventListener("click", config.interface.listeners.print, false);
    config.elements.clear.addEventListener("click", config.interface.listeners.clear, false);
    config.elements.reload.addEventListener("click", config.interface.listeners.reload, false);
    config.elements.expand.addEventListener("click", config.interface.listeners.expand, false);
    config.elements.support.addEventListener("click", config.interface.listeners.support, false);
    config.elements.donation.addEventListener("click", config.interface.listeners.donation, false);
    config.elements.collapse.addEventListener("click", config.interface.listeners.collapse, false);
    config.elements.footer.submit.addEventListener("click", config.interface.listeners.submit, false);
    config.elements.scroll.top.addEventListener("click", config.interface.listeners.scroll.top, false);
    config.elements.footer.textarea.addEventListener("input", config.interface.listeners.input, false);
    config.elements.session.addEventListener("click", config.interface.listeners.session.create, false);
    config.elements.options.max.addEventListener("change", config.interface.listeners.options.max, false);
    config.elements.options.fold.addEventListener("change", config.interface.listeners.options.fold, false);
    config.elements.options.dark.addEventListener("change", config.interface.listeners.options.dark, false);
    config.elements.options.topk.addEventListener("change", config.interface.listeners.options.topk, false);
    config.elements.options.font.addEventListener("change", config.interface.listeners.options.font, false);
    config.elements.scroll.bottom.addEventListener("click", config.interface.listeners.scroll.bottom, false);
    config.elements.footer.textarea.addEventListener("keypress", config.interface.listeners.keypress, false);
    config.elements.options.streaming.addEventListener("change", config.interface.listeners.options.streaming, false);
    config.elements.button.sessions.addEventListener("click", config.interface.listeners.toggle.button.sessions, false);
    config.elements.button.settings.addEventListener("click", config.interface.listeners.toggle.button.settings, false);
    config.elements.options.temperature.addEventListener("change", config.interface.listeners.options.temperature, false);
    /*  */
    if (window.markdownit) {
      config.engine.markdown = window.markdownit({
        "indentUnit": 2,
        "tabMode": "indent",
        "lineNumbers": true,
        "lineWrapping": true,
        "matchBrackets": true,
        "mode": "text/x-markdown",
        "highlight": function (code, lang) {
          const escapeHtml = config.engine.markdown.utils.escapeHtml;
          /*  */
          try {
            if (lang && lang !== "auto" && hljs.getLanguage(lang)) {
              const result = hljs.highlight(code, {"language": lang, "ignoreIllegals": true});
              return '<pre class="hljs language-' + escapeHtml(lang.toLowerCase()) + '"><code>' + result.value + '</code></pre>';
            } else if (lang === "auto") {
              const result = hljs.highlightAuto(code);
              return '<pre class="hljs language-' + escapeHtml(result.language) + '"><code>' + result.value + '</code></pre>';
            }
          } catch (e) {
            if (config.log) {
              console.error(e);
            }
          }
          /*  */
          return '<pre class="hljs"><code>' + escapeHtml(code) + '</code></pre>';
        }
      }).use(window.markdownitIns).use(window.markdownitSub).use(window.markdownitSup).use(window.markdownitAbbr)
      .use(window.markdownitMark).use(window.markdownitEmoji).use(window.markdownitDeflist).use(window.markdownitFootnote);
    }
    /*  */
    config.storage.load(config.app.start);
    window.removeEventListener("load", config.load, false);
  },
  "app": {
    "error": function () {
      document.documentElement.removeAttribute("busy");
      document.documentElement.removeAttribute("loading");
      document.documentElement.removeAttribute("destroyed");
      /*  */
      document.documentElement.setAttribute("error", '');
    },
    "highlight": {
      "active": {
        "chat": function () {
          const table = config.elements.content.sessions.querySelector("table");
          /*  */
          [...table.querySelectorAll("tr")].map(tr => {
            const current = document.documentElement.getAttribute("session");
            /*  */
            if (current === tr.getAttribute("session")) {
              tr.setAttribute("active", '');
            } else {
              tr.removeAttribute("active");
            }
          });
        }
      }
    },
    "chats": {
      "store": async function () {
        await new Promise(resolve => {
          const _chats = {};
          const chats = config.engine.ai.session.chats;
          const max = config.storage.read("options-max") !== undefined ? config.storage.read("options-max") : 10;
          /*  */
          try {
            const sorted = config.app.chats.sort(chats, max);
            if (sorted && sorted.length) {
              for (let i = 0; i < sorted.length; i++) {
                const id = sorted[i];
                _chats[id] = chats[id];
              }
            }
            /*  */
            config.storage.write("chats", _chats, resolve);
          } catch (e) {
            if (config.log) {
              console.error(e);
            }
          }
        });
      },
      "sort": function (chats, max) {
        let keys = [];
        /*  */
        try {
          const _dates = {};
          /*  */
          for (const id in chats) {
            const chat = chats[id];
            const item = chat[chat.length - 1];
            const date = new Date(item.time);
            _dates[id] = date;
          }
          /*  */
          keys = Object.keys(_dates);
          keys.sort((a, b) => _dates[a] < _dates[b] ? -1 : +1);
          if (max) keys = keys.slice(0).slice(-1 * Number(max));
        } catch (e) {
          if (config.log) {
            console.error(e);
          }
        }
        /*  */
        return keys;
      }
    },
    "start": async function () {
      document.documentElement.removeAttribute("dark");
      document.documentElement.removeAttribute("busy");
      document.documentElement.removeAttribute("error");
      document.documentElement.removeAttribute("destroyed");
      /*  */
      document.documentElement.setAttribute("loading", '');
      await config.interface.wait(300);
      /*  */
      try {
        if (window.LanguageModel) {
          const availability = await window.LanguageModel.availability();
          /*  */
          if (availability === "downloading" ) {
            window.setTimeout(config.app.error, 300);
            window.alert("The app is not ready yet! please wait for the AI components to load.");
          } else {
            const params = await window.LanguageModel.params();
            /*  */
            if (params) {
              config.engine.ai.defaults = params;
              /*  */
              const max = config.storage.read("options-max") !== undefined ? config.storage.read("options-max") : 10;
              const font = config.storage.read("options-font") !== undefined ? config.storage.read("options-font") : 14;
              const fold = config.storage.read("options-fold") !== undefined ? config.storage.read("options-fold") : false;
              const dark = config.storage.read("options-dark") !== undefined ? config.storage.read("options-dark") : false;
              const streaming = config.storage.read("options-streaming") !== undefined ? config.storage.read("options-streaming") : true;
              const topk = config.storage.read("options-topk") !== undefined ? config.storage.read("options-topk") : config.engine.ai.defaults.defaultTopK;
              const temperature = config.storage.read("options-temperature") !== undefined ? config.storage.read("options-temperature") : config.engine.ai.defaults.defaultTemperature;
              /*  */
              config.elements.options.max.value = max;
              config.elements.options.font.value = font;
              config.elements.options.topk.value = topk;
              config.elements.options.fold.checked = fold;
              config.elements.options.dark.checked = dark;
              document.documentElement.removeAttribute("loading");
              config.elements.options.streaming.checked = streaming;
              config.elements.options.temperature.value = temperature;
              if (dark) document.documentElement.setAttribute("dark", '');
              document.documentElement.style.setProperty("--font-size", font + "px");
              /*  */
              config.render.sidebar();
              /*  */
              if (availability === "downloadable") {
                window.alert("The Gemini Nano API needs to download training data for the first time. Please press the - Create a new session (+) - button on the left toolbar to start the app.");
              } else {
                config.elements.session.click();
              }
            }
          }
        } else {
          window.setTimeout(config.app.error, 300);
          window.alert("AI is not yet supported in this browser!");
        }
      } catch (e) {
        window.setTimeout(config.app.error, 300);
        window.alert("AI is not yet supported in this browser!");
      }
    }
  },
  "render": {
    "sidebar": function () {
      const table = config.elements.content.sessions.querySelector("table");
      const chats = config.storage.read("chats") !== undefined ? config.storage.read("chats") : {};
      /*  */
      if (chats) {
        table.textContent = '';
        const sorted = config.app.chats.sort(chats, '');
        if (sorted && sorted.length) {
          for (let i = sorted.length - 1; i >=0 ; i--) {
            const id = sorted[i];
            const chat = chats[id];
            config.render.chat(id, chat, table);
          }
        }
      }
      /*  */
      config.app.highlight.active.chat();
      config.interface.focus(300);
    },
    "time": function (data, target) {
      try {
        const header = target.querySelector(".header .time");
        const user = target.querySelector(".user .title .time");
        /*  */
        target.open = true;
        user.textContent = data ? data : "N/A";
        document.documentElement.removeAttribute("loading");
        header.textContent = '(' + (data ? data : "N/A") + ')';
      } catch (e) {
        if (config.log) {
          console.error(e);
        }
      }
    },
    "question": function (data, target) {
      try {
        const question = target.querySelector(".user .question");
        const details = question.querySelector("details");
        const textarea = details.querySelector("textarea");
        const height = textarea.scrollHeight;
        /*  */
        textarea.value = data ? data : "N/A";
        textarea.style.height = (height < 42 ? 42 : (height > 42 ? height + 4 : height)) + "px";
        details.open = true;
        target.open = true;
      } catch (e) {
        if (config.log) {
          console.error(e);
        }
      }
    },
    "answer": function (data, target) {
      try {
        const answer = target.querySelector(".ai .answer");
        const details = answer.querySelector("details");
        const content = details.querySelector(".content");
        /*  */
        target.open = true;
        details.open = true;
        content.textContent = '';
        /*  */
        const parser = new DOMParser();
        const txt = config.engine.markdown.render(data || '');
        const doc = parser.parseFromString(txt, "text/html");
        [...doc.body.childNodes].map(function (e) {content.appendChild(e)});
        /*  */
        const height = parseInt(window.getComputedStyle(config.elements.chat).height);
        if (config.elements.chat.scrollHeight - config.elements.chat.scrollTop === height) config.interface.autoscroll = true;
        if (config.interface.autoscroll) {
          config.elements.chat.scrollTop = config.elements.chat.scrollHeight;
        }
      } catch (e) {
        if (config.log) {
          console.error(e);
        }
      }
    },
    "chat": function (id, chat, parent) {
      if (chat) {
        const target = chat[chat.length - 1];
        if (target) {
          const tr = document.createElement("tr");
          const index = document.createElement("td");
          const remove = document.createElement("td");
          const session = document.createElement("td");
          /*  */
          remove.textContent = '⛌';
          session.textContent =  target.time;
          tr.setAttribute("session", id);
          index.setAttribute("session", id);
          remove.setAttribute("session", id);
          session.setAttribute("session", id);
          index.setAttribute("class", "index");
          remove.setAttribute("class", "remove");
          session.setAttribute("class", "session");
          remove.addEventListener("click", config.interface.listeners.remove);
          index.textContent = chat.length + " Chat" + (chat.length === 1 ? '' : 's');
          session.addEventListener("click", config.interface.listeners.session.load);
          /*  */
          tr.appendChild(index);
          tr.appendChild(session);
          tr.appendChild(remove);
          /*  */
          parent.appendChild(tr);
        }
      }
    }
  },
  "interface": {
    "autoscroll": true,
    "wait": async function (timeout) {
      await new Promise(resolve => {
        window.setTimeout(resolve, timeout ? timeout : 300);
      });
    },
    "focus": function (timeout) {
      window.setTimeout(function () {
        config.elements.footer.textarea.focus();
      }, timeout ? timeout : 300);
    },
    "listeners": {
      "print": function () {
        window.print();
      },
      "reload": function () {
        document.location.reload();
      },
      "support": function () {
        const url = config.addon.homepage();
        chrome.tabs.create({"url": url, "active": true});
      },
      "donation": function () {
        const url = config.addon.homepage() + "?reason=support";
        chrome.tabs.create({"url": url, "active": true});
      },
      "keypress": function (e) {
        if (e.shiftKey === false && (e.key === "Enter" || e.keyCode === 13)) {
          e.preventDefault();
          config.elements.footer.submit.click(e);
        }
      },
      "expand": function () {
        const details = [...config.elements.chat.querySelectorAll(".item")];
        if (details && details.length) {
          details.map(e => e.open = true);
        }
      },
      "collapse": function () {
        const details = [...config.elements.chat.querySelectorAll(".item")];
        if (details && details.length) {
          details.map(e => e.open = false);
        }
      },
      "chat": function (e) {
        if (e) {
          if (e.isTrusted) {
            config.interface.autoscroll = false;
          }
        }
      },
      "input": function (e) {
        const scrollheight = e.target.scrollHeight;
        const height = scrollheight < 53 ? 53 : ((scrollheight > 300 ? 300 : scrollheight));
        /*  */
        e.target.style.height = scrollheight + "px";
        config.elements.footer.submit.style.height = (height - 0) + "px";
        config.elements.container.style.height = "calc(100vh - " + (height + 1) + "px)";
      },
      "window": function (e) {
        if (e) {
          if (e.target) {
            const flag = e.target.closest(".chat") || e.target.closest(".footer");
            if (flag) {
              config.elements.toggle.sessions.setAttribute("state", "hide");
              config.elements.toggle.settings.setAttribute("state", "hide");
            }
          }
        }
      },
      "toggle": {
        "button": {
          "sessions": function () {
            let sessions = config.elements.toggle.sessions.getAttribute("state");
            /*  */
            sessions = sessions === "show" ? "hide" : "show";
            config.elements.toggle.sessions.setAttribute("state", sessions);
          },
          "settings": function () {
            let settings = config.elements.toggle.settings.getAttribute("state");
            /*  */
            settings = settings === "show" ? "hide" : "show";
            config.elements.toggle.settings.setAttribute("state", settings);
          }
        }
      },
      "remove": async function (e) {
        const id = {};
        /*  */
        id.session = e.target.getAttribute("session");
        id.current = document.documentElement.getAttribute("session");
        /*  */
        if (id.session !== id.current) {
          config.engine.ai.session.chats = config.storage.read("chats") !== undefined ? config.storage.read("chats") : {};
          /*  */
          delete config.engine.ai.session.chats[id.session];
          delete config.engine.ai.session.class[id.session];
          /*  */
          await config.app.chats.store();
          config.render.sidebar();
        }
      },
      "scroll": {
        "top": function () {
          const top = 0;
          config.interface.autoscroll = false;
          config.elements.chat.scrollTo({
            "top": top,
            "behavior": "smooth"
          });
        },
        "bottom": function () {
          const top = config.elements.chat.scrollHeight;
          config.interface.autoscroll = true;
          config.elements.chat.scrollTo({
            "top": top,
            "behavior": "smooth"
          });
        }
      },
      "clear": async function () {
        const flag = window.confirm("Are you sure you want to clear all sessions?");
        if (flag) {
          config.engine.ai.session.chats = config.storage.read("chats") !== undefined ? config.storage.read("chats") : {};
          /*  */
          for (let id in config.engine.ai.session.chats) {
            const current = document.documentElement.getAttribute("session");
            /*  */
            if (id !== current) {
              delete config.engine.ai.session.chats[id];
              delete config.engine.ai.session.class[id];
              /*  */
              await config.app.chats.store();
              config.render.sidebar();
            }
          }
        }
      },
      "copy": function (e) {
        if (e) {
          e.preventDefault();
          /*  */
          try {
            if (e.target) {
              const answer = e.target.closest(".answer");
              if (answer) {
                const content = answer.querySelector(".content");
                if (content) {
                  navigator.clipboard.writeText(content.innerText);
                }
              }
            }
          } catch (e) {
            if (config.log) {
              console.error(e);
            }
          }
        }
      },
      "loader": function (node, question) {
        const answer = "Generating the answer, please wait...";
        const fold = config.storage.read("options-fold") !== undefined ? config.storage.read("options-fold") : false;
        /*  */
        config.elements.footer.textarea.value = '';
        config.elements.footer.submit.style.height = "52px";
        config.elements.footer.textarea.style.height = "42px";
        config.elements.container.style.height = "calc(100vh - 53px)";
        /*  */
        if (fold) {
          const items = [...document.querySelectorAll(".container .chat .item")];
          if (items && items.length) {
            items.map(function (item) {
              item.open = false;
            });
          }
        }
        /*  */
        document.documentElement.setAttribute("loading", '');
        config.render.question(question, node);
        config.render.answer(answer, node);
      },
      "options": {
        "fold": function (e) {
          if (e) {
            if (e.target) {
              config.storage.write("options-fold", e.target.checked);
            }
          }
        },
        "dark": function (e) {
          if (e) {
            if (e.target) {
              document.documentElement.removeAttribute("dark");
              config.storage.write("options-dark", e.target.checked);
              if (e.target.checked) document.documentElement.setAttribute("dark", '');
            }
          }
        },
        "streaming": function (e) {
          if (e) {
            if (e.target) {
              config.storage.write("options-streaming", e.target.checked);
            }
          }
        },
        "font": function (e) {
          if (e) {
            if (e.target) {
              config.storage.write("options-font", e.target.value);
              document.documentElement.style.setProperty("--font-size", e.target.value + "px");
            }
          }
        },
        "max": async function (e) {
          if (e) {
            if (e.target) {
              config.storage.write("options-max", e.target.value);
              await config.app.chats.store();
              config.render.sidebar();
            }
          }
        },
        "temperature": function (e) {
          if (e) {
            if (e.target) {
              config.storage.write("options-temperature", e.target.value);
            }
          }
        },
        "topk": function (e) {
          if (e) {
            if (e.target) {
              config.storage.write("options-topk", e.target.value);
            }
          }
        }
      },
      "session": {
        "controller": null,
        "create": async function (e, id) {
          try {
            const tmp = config.engine.ai.session.class;
            const topk = config.storage.read("options-topk") !== undefined ? config.storage.read("options-topk") : config.engine.ai.defaults.topK;
            const temperature = config.storage.read("options-temperature") !== undefined ? config.storage.read("options-temperature") : config.engine.ai.defaults.temperature;
            /*  */
            document.documentElement.setAttribute("loading", '');
            config.interface.listeners.session.controller = new AbortController();
            /*  */
            const session = await window.LanguageModel.create({
              "topK": Number(topk),
              "temperature": Number(temperature),
              /*
              "expectedInputs": [{
                "type": "text", 
                "languages": ["en"]
              }],
              "expectedOutputs": [{
                "type": "text",
                "languages": ["en"]
              }],
              */
              "monitor": function (m) {
                m.addEventListener("downloadprogress", function (e) {
                  if (e) {
                    if (e.loaded === e.total) {
                      config.elements.footer.textarea.value = '';
                    } else {
                      const current = (e.loaded * 100).toFixed(2);
                      config.elements.footer.textarea.value = `Downloading training data: ${current}%, please wait...`;
                    }
                  }
                });
              }
            });
            /*  */
            id = id ? id : Math.floor(Math.random() * 1e7) + '';
            /*  */
            tmp[id] = session;
            config.interface.autoscroll = true;
            config.elements.chat.textContent = '';
            config.elements.footer.textarea.value = '';
            document.documentElement.removeAttribute("loading");
            document.documentElement.setAttribute("session", id);
            document.documentElement.removeAttribute("destroyed");
            /*  */
            config.engine.ai.session.chats = config.storage.read("chats") !== undefined ? config.storage.read("chats") : {};
            config.engine.ai.session.class = tmp;
            config.interface.focus(300);
          } catch (e) {
            if (config.log) {
              console.error(e);
            }
            /*  */
            window.alert("Could not generate the AI session! please try again.");
          }
        },
        "load": async function (e) {
          const id = {};
          /*  */
          id.session = e.target.getAttribute("session");
          document.documentElement.removeAttribute("destroyed");
          id.current = document.documentElement.getAttribute("session");
          /*  */
          if (id.session) {
            if (id.session !== id.current) {
              if (document.documentElement.getAttribute("busy") === null) {
                config.engine.ai.session.chats = config.storage.read("chats") !== undefined ? config.storage.read("chats") : {};
                if (config.engine.ai.session.chats) {
                  const current = config.engine.ai.session.chats[id.session];
                  if (current) {
                    config.elements.button.sessions.click();
                    config.elements.chat.textContent = '';
                    /*  */
                    await config.interface.wait(300);
                    await config.interface.listeners.session.create(null, id.session);
                    /*  */
                    for (let i = 0; i < current.length; i++) {
                      if (document.documentElement.getAttribute("destroyed") === null) {
                        await config.interface.listeners.submit(null, i, current[i].question);
                      }
                    }
                  }
                }
              } else {
                window.alert("The app is busy! please wait for the current session to complete and try again.");
              }
            } else {
              config.elements.button.sessions.click();
            }
          }
        }
      },
      "submit": async function (event, index, question) {
        if (event !== null) {
          if (config.engine.ai.session.current) {
            if (document.documentElement.getAttribute("busy") !== null) {
              config.engine.ai.session.current.destroy();
              question = '!';
            }
          }
        }
        /*  */
        let _answer = '';
        let _time = "N/A";
        let _question = '';
        let _error = "Could not generate the answer! please try again.";
        /*  */
        try {
          const template = document.querySelector("template");
          if (template) {
            const item = template.content.querySelector(".item");
            if (item) {
              const node = document.importNode(item, true);
              if (node) {
                _question = question ? question : config.elements.footer.textarea.value;
                if (_question) {
                  config.elements.chat.appendChild(node);
                  config.interface.listeners.loader(node, _question);
                  /*  */
                  const id = document.documentElement.getAttribute("session");
                  const copy = node.querySelector(".ai .answer .header .copy");
                  /*  */
                  copy.addEventListener("click", config.interface.listeners.copy);
                  /*  */
                  if (id) {
                    config.engine.ai.session.current = config.engine.ai.session.class[id];
                    if (config.engine.ai.session.current) {
                      if (event !== null) config.interface.autoscroll = true;
                      document.documentElement.setAttribute("busy", '');
                      config.render.question(_question, node);
                      /*  */
                      try {
                        const chats = config.engine.ai.session.chats;
                        const current = chats[id] !== undefined ? chats[id] : [];
                        const signal = {"signal": config.interface.listeners.session.controller.signal};
                        const streaming = config.storage.read("options-streaming") !== undefined ? config.storage.read("options-streaming") : true;
                        /*  */
                        if (streaming) {
                          const answer = await config.engine.ai.session.current.promptStreaming(_question, signal);
                          /*  */
                          for await (const chunk of answer) {
                            _answer += chunk ? chunk : _error;
                            /*  */
                            config.render.answer(_answer, node);
                          }
                        } else {
                          const answer = await config.engine.ai.session.current.prompt(_question, signal);
                          /*  */
                          _answer = answer ? answer : _error;
                          config.render.answer(_answer, node);
                        }
                        /*  */
                        _time = (new Date()).toLocaleString();
                        config.render.time(_time, node);
                        /*  */
                        if (index !== undefined) {
                          current[index].time = _time;
                          current[index].answer = _answer;
                          current[index].question = _question;
                        } else {
                          current.push({
                            "time": _time,
                            "answer": _answer,
                            "question": _question
                          });
                        }
                        /*  */
                        config.engine.ai.session.chats[id] = current;
                        await config.app.chats.store();
                        config.render.sidebar();
                      } catch (e) {
                        _time = (new Date()).toLocaleString();
                        config.render.time(_time, node);
                        /*  */
                        if (e) {
                          if (e.message) {
                            config.render.answer(e.message, node);
                            if (e.message.indexOf("destroyed") !== -1) {
                              if (event !== null) {
                                document.documentElement.removeAttribute("loading");
                                document.documentElement.setAttribute("destroyed", '');
                                window.alert("The current session is destroyed, please reload the app or try a different session.");
                              }
                            }
                          }
                        }
                      }
                      /*  */
                      document.documentElement.removeAttribute("busy");
                    }
                  }
                } else {
                  window.alert("Please enter a prompt and try again!");
                  config.interface.focus(300);
                }
              }
            }
          }
        } catch (e) {
          if (config.log) {
            console.error(e);
          }
        }
      }
    }
  }
};

config.port.connect();

window.addEventListener("load", config.load, false);
window.addEventListener("resize", config.resize.method, false);
window.addEventListener("click", config.interface.listeners.window, false);
