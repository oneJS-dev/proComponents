import {
    Component, BaseComponent, readFlavor, mergeStyles, media
} from '@onejs-dev/core';
import {
    View, Text, Icon, Modal, Input, HtmlIFrame, HtmlPre, HtmlCode
} from '@onejs-dev/components';

import React from 'react';

import {Sandpack as _Sandpack} from "@codesandbox/sandpack-react";
import {
    SandpackProvider as _SandpackProvider,
    SandpackLayout as _SandpackLayout,
    SandpackCodeEditor as _SandpackCodeEditor,
    SandpackCodeViewer as _SandpackCodeViewer,
    SandpackPreview as _SandpackPreview,
} from "@codesandbox/sandpack-react";

const navbarMenuIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<circle cx="50" cy="15" r="10"/><g><path d="M100,42c0,1.65-1.35,3-3,3H3c-1.65,
0-3-1.35-3-3v-4c0-1.65,1.35-3,3-3h94c1.65,0,3,1.35,3,3V42z"/></g>
<g><path d="M100,67c0,1.65-1.35,3-3,3H3c-1.65,0-3-1.35-3-3v-4c0-1.65,1.35-3,3-3h94c1.65,0,3,1.35,3,
3V67z"/></g>
<g><path d="M100,92c0,1.65-1.35,3-3,3H3c-1.65,0-3-1.35-3-3v-4c0-1.65,1.35-3,3-3h94c1.65,0,3,1.35,3,
3V92z"/></g></svg>`;
export const Navbar = Component('Navbar', false, ({position = 'top', size, items,
    menuIcon = navbarMenuIcon, menuCollapse = 'tablet', flavor = readFlavor('default'),
    ...attributes} = {}) => {
    let [menuVisible, setMenuVisible] = React.useState(false);
    let [currentUrl, setCurrentUrl] = React.useState(decodeURI(location.pathname +
        location.search));
    React.useEffect(() => {
        window.addEventListener('urlChange',
            (e) => setCurrentUrl(decodeURI(location.pathname + location.search)), false);
    }, []);
    if(!(items?.length > 0)) return null;

    let logoItem;
    if(items[0].logo) logoItem = items[0];

    const bottomStyle = {
        bottom: 0,
        borderTopWidth: flavor?.borderWidth ?? 1,
        borderTopStyle: flavor?.borderStyle ?? 'solid',
        borderTopColor: flavor?.borderColor ?? '#ccc'
    };
    const topStyle = {
        top: 0,
        borderBottomWidth: flavor?.borderWidth ?? 1,
        borderBottomStyle: flavor?.borderStyle ?? 'solid',
        borderBottomColor: flavor?.borderColor ?? '#ccc'
    };
    let navbarStyle = {
        zIndex: 10,
        position: 'fixed',
        right: 0,
        width: size?.width ?? '100%',
        height: size?.height ?? 80,
        background: flavor?.backgroundGradient ?? flavor?.backgroundColor ?? 'white',
        ...flavor?.shadow
    };
    attributes['style'] = mergeStyles(navbarStyle, position === 'top' ? topStyle : bottomStyle,
        attributes['style']);
    const logoStyle = {
        paddingInline: 'max(20px, 5vw)',
        cursor: 'pointer'
    };
    const itemContainerStyle = {
        paddingInline: 'max(20px, 5vw)',
        display: 'flex',
        ...media({device: menuCollapse})({display: 'none !important'}),
        ...media({device: 'phone'})({paddingInline: 0})
    };
    const itemStyle = {
        transitionDuration: '0.4s',
        position: 'relative',
        height: '100%',
        '&:hover > div': {
            visibility: 'visible'
        },        
        display: 'flex',
        visibility: 'visible',
        flexBasis: 0,
        ...media({device: menuCollapse})({display: 'none !important'})
    };
    const itemViewStyle = {
        cursor: 'pointer',
        '&:hover > p': {
            textDecoration: 'underline'
        },
    };
    const subitemStyle = {
        visibility: 'hidden',
        position: 'absolute',
        top: 80,
        width: 'max-content',
        maxWidth: 400,
        overflow: 'hidden',
        boxSizing: 'border-box',
        '& p:not(:first-child)': {
            borderTopWidth: flavor?.borderWidth ?? 1,
            borderTopStyle: flavor?.borderStyle ?? 'solid',
            borderTopColor: flavor?.borderColor ?? '#ccc'
        }
    };
    const subitemTextStyle = {
        zIndex: 10,
        lineHeight: 3,
        paddingInline: 20,
        '&:hover': {
            background: flavor?.lightColor ?? '#ccc'
        }
    };
    const menuStyle = {
        width: 'auto',
        minWidth: 300,
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '80vh',
        top: 80,
        left: 'initial',
        right: 'max(20px, 5vw)',
        transform: 'none',
        '& div:not(:first-child)': {
            borderTopWidth: flavor?.borderWidth ?? 1,
            borderTopStyle: flavor?.borderStyle ?? 'solid',
            borderTopColor: flavor?.borderColor ?? '#ccc'
        },
        display: 'none',
        ...media({device: menuCollapse})({display: 'flex !important'})
    };
    const menuIconStyle = {
        cursor: 'pointer',
        paddingInline: 'max(20px, 5vw)',
        display: 'none',
        ...media({device: menuCollapse})({display: 'flex !important'})
    };
    const collapsedItemStyle = {
        paddingLeft: 20,
        minHeight: 50,
        cursor: 'pointer'
    };
    const collapsedItemTextStyle = {
        display: 'flex',
        flexGrow: 1,
        fontWeight: 'bold'
    };
    const collapsedSubitemTextStyle = {
        paddingLeft: 40,
        lineHeight: 2.5,
        fontSize: flavor?.textSize > 0 ? Math.round(flavor.textSize * 0.9) : 14
    };
    const activeFlavor = {
        ...flavor, textColor: flavor?.primaryColor ?? 'blue',
        primaryColor: flavor?.primaryColor ?? 'blue'
    };
    const inactiveFlavor = {
        ...flavor, textColor: flavor?.darkColor ?? '#666',
        primaryColor: flavor?.darkColor ?? '#666'
    };
    const menuFlavor = {...flavor, textWeight: 'bold'};

    const matchUrl = (targetUrl, currentUrl) => {
        const targetUrlArray = targetUrl.split('/').filter(Boolean);
        const currentUrlArray = currentUrl.split('/').filter(Boolean);
        let isMatch = true;
        targetUrlArray.forEach((item, index) => {
            if(targetUrlArray[index] !== currentUrlArray[index]) isMatch = false;
        });
        return isMatch;
    };

    return [View({
        type: 'navbar', content: {h: 'center', v: 'center'}, key: 'navbar', style: navbarStyle,
        ...attributes
    })([
        //Logo
        logoItem && View({url: logoItem.url, self: {expand: 1}})([Icon({
            icon: logoItem.logo, size: 'auto', style: logoStyle, key: 'logo'
        })]),
        //Non-collapsed Items
        View({
            content: {h: 'distribute', v: 'center', gap: 0}, self: {align: 'stretch', expand: 1},
            style: itemContainerStyle, key: 'non-collapsed'
        })([items.map((item, index) => {
            let isActive = matchUrl(item.url, currentUrl);
            let hasSubitems = item.items?.length > 0;
            if(item.logo) return;
            return View({
                content: {h: 'center', v: 'center', direction: 'column'},
                self: {shrink: 0, expand: 1}, style: itemStyle, key: index //Important Key
            })([
                View({
                    content: {h: 'center', v: 'center', direction: 'column'}, style: itemViewStyle,
                    self: {align: 'stretch', shrink: 0, expand: 1}, url: item.url, key: 'view'
                })([
                    //Item Icon
                    item.icon && Icon({
                        icon: item.icon, flavor: isActive ? activeFlavor : inactiveFlavor, 
                        key: 'icon'
                    }),
                    //Item Text
                    item.text && Text({
                        flavor: isActive ? activeFlavor : inactiveFlavor, key: 'text'
                    })(item.text + (hasSubitems ? ' 🞃' : ''))
                ]),
                //Subitems
                hasSubitems && View({
                    content: {h: 'stretch', v: 'left', direction: 'column'}, flavor: flavor,
                    style: subitemStyle, key: 'view' + index
                })(item.items.map((subitem, subindex) => {
                    let isSubitemActive = matchUrl(subitem.url, currentUrl);
                    return Text({
                        flavor: isSubitemActive ? activeFlavor : inactiveFlavor, 
                        style: subitemTextStyle, url: subitem.url, key: index + subindex //Important Key
                    })(subitem.text)
                }))
            ]);
        })]),
        //Collapsed Items
        Icon({
            icon: menuIcon, flavor: menuVisible ? activeFlavor : inactiveFlavor,
            onClick: () => setMenuVisible(true), style: menuIconStyle, key: 'menuIcon'
        }),
    ]), Modal({
        visible: menuVisible, style: menuStyle, animation: {visible: ['fade-in', 'fade-out']},
        backdrop: false, flavor: menuFlavor, closeIcon: false, key: 'modal',
        footer: [Input({
            type: 'button', title: 'Close', flavor: readFlavor('reject'),
            onClick: () => setMenuVisible(false)
        })]
    })([//Collapsed menu
        View({
            content: {h: 'left', v: 'top', direction: 'column'}, self: {align: 'stretch'},
            style: {overflow: 'auto'}, key: 'collapsed' //Important key
        })([items.map((item, index) => {
            let isActive = matchUrl(item.url, currentUrl);
            let hasSubitems = item.items?.length > 0;
            if(item.logo) return;
            //Collapsed items
            return [View({
                content: {h: 'left', v: 'center', gap: 20}, self: {align: 'stretch'},
                style: collapsedItemStyle, url: item.url, key: index,
                onClick: () => {setMenuVisible(false);}
            })([//Collapsed item icon
                item.icon && Icon({
                    icon: item.icon, flavor: isActive ? activeFlavor : inactiveFlavor,
                    key: 'icon'
                }),
                //Collapsed item text
                item.text && Text({
                    flavor: isActive ? activeFlavor : inactiveFlavor,
                    style: collapsedItemTextStyle, key: 'text'
                })(item.text + (hasSubitems ? ' 🞃' : '')),
            ]),
                //Subitems
                hasSubitems && item.items.map((subitem, subindex) => {
                    let isSubitemActive = matchUrl(subitem.url, currentUrl);
                    return View({
                        self: {align: 'stretch'}, url: subitem.url,
                        onClick: () => {setMenuVisible(false);}, key: subindex, //Important key
                        style: {cursor: 'pointer'}
                    })(Text({
                        flavor: isSubitemActive ? activeFlavor : inactiveFlavor,
                        style: collapsedSubitemTextStyle, key: 'text' + subindex
                    })(subitem.text))})]
                })
            ])
        ])
    ];
});
/**
*   - autoResize: Automatically resize the embed to the content (only works on Medium).
*       -Values: true/false or 0/1
*       -Default: true
*   - codemirror: Use CodeMirror editor instead of Monaco (decreases embed size significantly).
*       -Values: true/false or 0/1
*       -Default: true
*   - editorSize: Size in percentage of editor.
*       -Values: number
*       -Default: 50
*   - eslint: Use eslint (increases embed size significantly).
*       -Values: true/false or 0/1
*       -Default: false
*   - expandDevTools: Start with the devtools (console) open.
*       -Values: true/false or 0/1
*       -Default: false
*   - hideDevTools: Hide the DevTools bar of the preview.
*       -Values: true/false or 0/1
*       -Default: true
*   - fontSize: Font size of editor
*       -Values: number (in px)
*       -Default: 12
*   - forceRefresh: Force a full refresh of frame after every edit.
*       -Values: true/false or 0/1
*       -Default: false
*   - hideNavigation: Hide the navigation bar of the preview.
*       -Values: true/false or 0/1
*       -Default: true
*   - highlights: Which lines to highlight (only works in CodeMirror)
*       -Values: Array or comma separated list of line numbers
*       -Default: []
*   - initialPath: Which url to initially load in address bar
*       -Values: string
*       -Default: /
*   - module: Which module to open by default. Multiple paths comma separated are allowed, in that
*     case we show them as tabs
*       -Values: path to module (starting with /)
*       -Default: entry path
*   - moduleView: Evaluate the file that is open in the editor.
*       -Values: true/false or 0/1
*       -Default: false
*   - previewWindow: Which preview window to open by default
*       -Values: console/tests/browser
*       -Default: browser
*   - runOnClick: Only load the preview when the user says so.
*       -Values: true/false or 0/1
*       -Default: false
*   - view: Which view to open by default
*       -Values: editor/split/preview
*       -Default: split, preview for small screens
*   - theme: Which theme to show for the embed
*       -Values: dark/light
*       -Default: light
*/
export const CodeSandbox = ({source, options = {}, title = '', height = 400, flavor,
    ...attributes} = {}) => {
    if(!source) return;
    let optionsArray = [];
    options = {
        hideNavigation: true, theme: 'light', fontSize: 12, hideDevTools: true, autoResize: true,
        codemirror: true, ...options
    };
    Object.entries(options).forEach(([key, value]) => {
        key = key.toLowerCase();
        if(key === 'highlights' && Array.isArray(value)) value.join(',');
        if(typeof value === 'boolean') value = value ? 1 : 0;
        optionsArray.push(`${key}=${value}`);
    });
    source += '?' + optionsArray.join('&');

    return View({flavor: flavor, ...attributes})(HtmlIFrame({
        src: source,
        style: `width:100%; height:${height}${typeof height === 'number' ? 'px' : ''}; border:0; 
        border-radius:${flavor?.radius ?? 0}px; overflow:hidden;`,
        title: title,
        allow: `accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope;
             hid; microphone; midi; payment; usb; vr; xr-spatial-tracking`,
        sandbox: `allow-forms allow-modals allow-popups allow-presentation allow-same-origin 
            allow-scripts`
    })());
};

/*
//Sandpack provider
template: By default your Sandpack instance starts with a predefined template. Each template contains all the files and dependencies needed to start a project.
vanilla default
files The files prop accepts an object, where each key is the relative path of that file in the sandbox folder structure. Files passed in through the files prop override those in the template structure
filesDon't forget the leading slash (/) when setting the file paths.
    - hidden files that you don't want to show to the user
    - active the file open in the code editor when the component mounts
    - readOnly You can set one, multiple files, or the entire Sandpack (through options object) as read-only, which will make all files non-editable.
    showReadOnly you can hide the Read-only label which appears on top of the code editor:
dependencies: 
files={{
        "/App.js": code,
      }}
dependencies: {
      react: "17.0.2",
      "react-dom": "17.0.2",
      "react-scripts": "4.0.0",
    },
options={{

        showNavigator: true,//Using showNavigator you can toggle on a full browser navigator component
        showConsole: Standalone component to render the logs
        showConsoleButton shows a button to toggle the console

        SandpackCodeEditor and SandpackCodeViewer
        showTabs: true,     // you can force tabs to always be shown/hidden with the showTabs prop.
        closableTabs: true, //allows you to add a small close button for each tab, which removes it from the list
        readOnly: makes the entire project non-editable. 
        showLineNumbers: false, // default - true
        showInlineErrors: true, // default - false
        wrapContent: true, // default - false
        editorHeight: 350, // default - 300
        editorWidthPercentage: 60, // default - 50
        autorun: false //it will show a Run button that initializes the bundling process

        
      }}
    theme: light
*/
const Sandpack = BaseComponent('Sandpack', false, _Sandpack);

const SandpackProvider = BaseComponent('SandpackProvider', true, _SandpackProvider);
const SandpackLayout = BaseComponent('SandpackLayout', true, _SandpackLayout);
const SandpackCodeEditor = BaseComponent('SandpackCodeEditor', false, _SandpackCodeEditor);
const SandpackCodeViewer = BaseComponent('SandpackCodeViewer', false, _SandpackCodeViewer);
const SandpackPreview = BaseComponent('SandpackPreview', false, _SandpackPreview);

//type: viewer, editor, preview, both, device: phone, web
export const CodeDisplay = ({type = 'both', device = 'web', template = 'react', title = '',
    files = {}, code, dependencies={}, customSetup = {}, options = {}, highlight, size,
    flavor = readFlavor('default'), ...attributes} = {}) => {
    // template = 'oneJS';
    if(template === 'oneJS' && type !== 'viewer') {
        customSetup = {
            dependencies: {
                react: "18.2.0",
                "react-dom": "18.2.0",
                "@onejs-dev/components": '0.0.28',
                ...dependencies
            },
            entry: "/App.js",
            ...customSetup
        };
        files = {
            '/App.js': code ??
                `/* Imports: Required modules to setup the app =================================================== */
import { App, read, update } from "@onejs-dev/core";
import { Text, View, Input } from "@onejs-dev/components";

/* State: Any variable subject to change needs to be part of the state ========================== */
const state = { name: "World" };

/* Template function: Returns the structure to be rendered ====================================== */
const template = () => {
    return [
    View({ content: { h: "center", v: "center", direction: "column" } })([
        Text({ style: { fontSize: 22, paddingBlock: 60 } })(\`Hello \${read("name")}!\`),
        Input({ type: "text", value: read("name"), onChange: update("name") })
    ])
    ];
};

/* App: Run the app with the parameters provided ================================================ */
App({ theme: "oneJS", state: state })(template);

/* Learn: Refer to the docs section to learn all about oneJS: https://onejs.dev/docs============= */`,
            '/public/index.html': {
                code: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <meta
                  name="viewport"
                  content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes"
                />
                <link rel="icon" href="/assets/logos/favicon.svg" />
              </head>
              <body>
                <div id="app"></div>
              </body>
            </html>            
            `,
                hidden: true
            },
            ...files
        };
        template = 'react';
    }
    else if(type !== 'viewer' &&  Object.keys(dependencies).length > 0) {
        customSetup = {
            dependencies: dependencies,
            ...customSetup
        };
    }
    else if(type === 'viewer' && !(files && Object.keys(files).length > 0)) {
        const fileName = (typeof title === 'string' && title !== '') ? title : '/App.js';
        files[fileName] = {code: code ?? `console.log('Hello World');`, active: true};
    }

    //Highlight lines
    let decorators = [];
    let decoratorsStyle = {};
    if(Array.isArray(highlight) && highlight.length > 0) {
        decoratorsStyle = {
            '& .highlight': {
                background: '#094DFF2b',
                borderRadius: (flavor?.radius > 0) ? 4 : 0
            }
        };
        highlight.forEach(lineNumber => {
            decorators.push({className: 'highlight', line: lineNumber});
        });
    }
    attributes['style'] = mergeStyles(decoratorsStyle, attributes['style']);

    const editorOptions = {
        showTabs: options?.showTabs ?? type === 'viewer' ? false : true,     // you can force tabs to always be shown/hidden with the showTabs prop.
        // closableTabs: options?.closableTabs ?? true, //allows you to add a small close button for each tab, which removes it from the list
        readOnly: options?.readOnly ?? false, // makes the entire project non-editable. 
        showLineNumbers: options?.showLineNumbers ?? false, // default - true
        // showInlineErrors: options?.showInlineErrors ?? false, // default - false
        wrapContent: options?.wrapContent ?? false, // default - false
        decorators: decorators
    };

    const providerOptions = {
        autorun: options?.autorun ?? true //it will show a Run button that initializes the bundling process
    };
    const previewOptions = {
        showNavigator: options?.showNavigator ?? false,//Using showNavigator you can toggle on a full browser navigator component  
    };

    const editorStyle = {
        overflow: 'auto',
        width: size?.width ?? 'auto',
        maxHeight: size?.height ?? 500,
        maxWidth: '90vw'
    };

    const previewStyle = {
        overflow: 'auto',
        maxWidth: size?.width ?? '90vw',
        height: size?.height ?? 500,
        maxHeight: size?.height ?? 500,
    };

    const phoneStyle = {
        border: '10px solid black',
        borderRadius: 40,
        width: size?.height > 0 ? Math.round(size.height / 2) : 250,
        height: size?.height ?? 500,
        overflow: 'hidden'
        // marginLeft: 50
    };
    const titleBarStyle = {
        background: '#f5f5f5',
        height: 60,
        borderBottom: '1px solid #ccc'
    };
    const titleTextStyle = {
        fontSize: 18,
        fontWeight: 'bold'
    };

    template = 'react';

    let content = {h: 'center', v: 'stretch', direction: 'row', wrap: true, gap: 40};
    if(attributes['content']) {
        content = {...content, ...attributes['content']};
        delete attributes['content'];
    }

    return SandpackProvider({template: template, files: files, customSetup: customSetup, options: providerOptions, ...attributes})([
        // SandpackLayout()([
        View({content: content})([
            //Code Viewer
            type === 'viewer' && View({
                flavor: flavor, style: editorStyle
            })(SandpackCodeViewer(editorOptions)),
            //Code Editor
            (type === 'both' || type === 'editor') && View({
                flavor: flavor, style: editorStyle
            })(SandpackCodeEditor(editorOptions)),
            //Code Preview
            (type === 'both' || type === 'preview') && (device === 'phone' ?
                View({content: {direction: 'column', h: 'stretch', v: 'top'}, style: phoneStyle})([
                    title && View({content: {h: 'center', v: 'center'}, style: titleBarStyle})(
                        Text({style: titleTextStyle})(title)),
                    View({self: {expand: 1}})(SandpackPreview({style: {height: '100%'}, ...previewOptions}))
                ]) :
                View({
                    flavor: flavor, style: previewStyle, self: {expand: 1}
                })(SandpackPreview({style: {height: '100%'}, ...previewOptions}))),
        ])
        // ])
    ]);
};

const TextEditor = Component('TextEditor', true, ({language = 'javascript', title = '', os = 'web',
    onChange, size, windowMode = true, flavor = readFlavor('default'), ...attributes} = {}) =>
    code => {
        const editorStyle = {
            // marginRight: 50,
            // maxWidth: 'min(90vw, 500px)',
            // maxHeight: 500,
            width: '95vw',
            height: '95vh',
            maxWidth: size === 'large' ? 1000 : size === 'small' ? 300 : size?.width ?? 500,
            maxHeight: size === 'large' ? 600 : size === 'small' ? 200 : size?.height ?? 300,
            // overflowX: 'scroll'
            background: 'transparent',
            ...flavor?.shadow
        };
        const editorHeaderStyle = {
            height: 40,
            paddingLeft: 20,
            paddingRight: 20,
            // position: 'absolute',
            // top: 0,
            // left: 0,
            maxWidth: '100%',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            background: flavor?.lightColor ?? '#f1f1f1'
        };
        const editorCodeStyle = {
            // width: '100%',
            overflow: 'auto',
            padding: '0 15px 15px 15px',
            margin: 0
            // border: '1px solid #999', 

        };
        const editorButtonStyle = {
            padding: 5,
            transitionDuration: '0.4s',
            cursor: 'pointer',
            ':hover': {
                filter: 'brightness(110%)',
            },
            ':active': {
                filter: 'brightness(90%)',
            },
            ':focus': {
                outline: 'none',
            },
            '.disabled': {
                opacity: 0.6,
                cursor: 'not-allowed',
            }
        };
        const selectedBackgroundStyle = {
            background: flavor?.backgroundGradient ?? flavor?.backgroundColor ?? 'blue',
            borderRadius: flavor?.radius ?? 0
        };
        const unselectedBackgroundStyle = {background: 'white', borderRadius: flavor?.radius ?? 0};
        const selectedIconStyle = {fill: flavor?.lightColor ?? 'white'};
        const unselectedIconStyle = {fill: flavor?.neutralColor ?? '#999'};
        attributes['style'] = mergeStyles(editorStyle, attributes['style']);
        return View({
            content: {h: 'stretch', v: 'center', direction: 'column', wrap: false},
            flavor: flavor, ...attributes
        })([
            View({content: {h: 'space', v: 'center'}, style: editorHeaderStyle})([
                Text({style: {color: flavor?.textColor ?? '#666'}})(title),
                View({content: {h: 'center', v: 'center', gap: 10}})([
                    View({
                        content: {h: 'center', v: 'center'},
                        style: [editorButtonStyle, os === 'web' ? selectedBackgroundStyle :
                            unselectedBackgroundStyle],
                        onPress: () => {onChange('web');}
                    })(
                        Icon({
                            icon: globe, size: 20, style: os === 'web' ? selectedIconStyle :
                                unselectedIconStyle
                        })),
                    View({
                        content: {h: 'center', v: 'center'}, style: [editorButtonStyle,
                            os === 'native' ? selectedBackgroundStyle : unselectedBackgroundStyle],
                        onPress: () => {onChange('native');}
                    })([
                        Icon({
                            icon: android, size: 20,
                            style: os === 'native' ? selectedIconStyle : unselectedIconStyle
                        }),
                        Icon({
                            icon: apple, size: 20,
                            style: os === 'native' ? selectedIconStyle : unselectedIconStyle
                        })])])]),

            View({content: {h: 'top', v: 'left'}, style: editorCodeStyle, self: {expand: 1}})([
                HtmlPre({inlineStyle: {background: 'white', padding: 0, margin: 0}})(HtmlCode({class: 'language-' + language, inlineStyle: {background: 'white', padding: 0, margin: 0}})(code)),
            ])
        ]);
    });