blog = document.getElementById("blog");
blogResponse = ""
server = "http://127.0.0.1:8000"
var currentIdx
var loader = m.trust('<div id="fountainG"><div id="fountainG_1" class="fountainG"></div><div id="fountainG_2" class="fountainG"></div><div id="fountainG_3" class="fountainG"></div><div id="fountainG_4" class="fountainG"></div><div id="fountainG_5" class="fountainG"></div><div id="fountainG_6" class="fountainG"></div> <div id="fountainG_7" class="fountainG"></div> <div id="fountainG_8" class="fountainG"></div> </div>')
var Data = {
    titles: {
        titlesJSON: {},
        keys: [],
        fetch: function() {
            m.request({
                    method: "POST",
                    url: server + "/blog/all/",
                    data: { 'field': 'titles' }
                })
                .then(function(result) {
                    //   window.setTimeout(function(){console.log('test')
                    //     Data.titles.titlesJSON = JSON.parse(result);
                    //     Data.titles.keys = Object.keys(Data.titles.titlesJSON);
                    //     m.redraw()
                    // },1500)
                    Data.titles.titlesJSON = JSON.parse(result);
                    Data.titles.keys = Object.keys(Data.titles.titlesJSON);
                })
        }
    },
    post: {
        body: {},
        fetch: function() {
            return m.request({
                    method: "POST",
                    url: server + "/blog/all/",
                    data: { 'field': 'post', 'idx': currentIdx }
                })
                .then(function(result) {

                    blogResponse = JSON.parse(result);

                    // Data.titles.titlesJSON = JSON.parse(result);
                    // Data.titles.keys = Object.keys(Data.titles.titlesJSON);
                    return blogResponse;
                })
        }
    },
    categories: {
        titlesJSON: {},
        keys: [],
        fetch: function() {
            return m.request({
                    method: "POST",
                    url: server + "/blog/all/",
                    data: { 'field': 'categories' }
                })
                .then(function(result) {
                    //   window.setTimeout(function(){console.log('test')
                    //     Data.titles.titlesJSON = JSON.parse(result);
                    //     Data.titles.keys = Object.keys(Data.titles.titlesJSON);
                    //     m.redraw()
                    // },1500)
                    Data.categories.categoriesJSON = JSON.parse(result);
                    Data.categories.keys = Object.keys(Data.categories.categoriesJSON);
                    // console.log(Data.categoriesJSON)
                    // Data.titles.keys = Object.keys(Data.titles.titlesJSON);
                })
        }
    },

}

blogComponent = {
    oninit: Data.post.fetch,
    oncreate: m.route.link,
    view: function() {


        return (blogResponse != "") ? m("main.blog", m('',
            m('.parallax', m("h1", { class: "title" }, blogResponse.title)),
            m(".", m.trust(markdown.toHTML(blogResponse.body)))
        )) : m(loader)
    }
}

categoriesComponent = {
    oninit: function() {
        self = this;
        self.selected = { items: [] };
        Data.categories.fetch().then(function() {
            self.ready = true;
            // m.redraw()
        });

    },
    getSelected: function() {

        self.ready = true;
        // m.redraw()
        return self.selected


    },
    view: function() {
        var me = this
        return [Data.categories.keys ? Data.categories.keys.map(function(key) {
            return m('span.mdl-chip mdl-chip--deletable',
                m('span.mdl-chip__text', {
                    oncreate: function() {
                        value = Data.categories.categoriesJSON[key]

                        me.selected.items.push({
                            category: value,
                            selected: true
                        })
                        console.log(typeof me.selected.items)
                    }
                }, Data.categories.categoriesJSON[key]),
                m('button.mdl-chip__action', {},
                    m('i.material-icons', {
                        innerText: 'check_circle',
                        onclick: function() {
                            _self = this;

                            me.selected.items.map(function(item) {

                                if (item.category == Data.categories.categoriesJSON[key]) {
                                    item.selected = !item.selected
                                    if (item.selected == false) {
                                        _self.innerText = 'cancel';
                                        // console.log(self.innerText)
                                    }
                                    if (item.selected == true) {
                                        _self.innerText = 'check_circle';
                                        // console.log(self.innerText)
                                    }
                                    // console.log(item.selected, )
                                }

                            })
                            // console.log(me.selected.items,this.innerText,Data.categories.categoriesJSON[key]);
                            // console.log(me.selected.items.indexOf(Data.categories.categoriesJSON[key]))


                        }
                    }))
            )
        }) : '']
    }
}
header = {

    view: function() {

        // Data.categories.keys?console.log(Data.categories.keys):''
        return m('.header', 'Header')
    }

}
titlesCards = {
    oninit: Data.titles.fetch,
    view: function(vnode) {
        var self = this;
        // var a= categoriesComponent.getSelected()
        // console.log(a)
        return Data.titles.keys.length > 0 ? Data.titles.keys.map(function(key) {
            var categories = categoriesComponent.getSelected()

            var show = true;
            categories.items.map(function(item) {
                if (item.category == Data.titles.titlesJSON[key].category) {
                    console.log(item.category,item.selected)
                    if (!item.selected){
                        show =false;    
                    }

                    

                }

            })
            return show? m('.demo-card-square.mdl-card mdl-shadow--2dp',
                m('.mdl-card__title mdl-card--expand',
                    m('h6.mdl-card__title-text', Data.titles.titlesJSON[key].title)),
                m('.mdl-card__supporting-text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Aenan convallis.',
                    m('.date', Data.titles.titlesJSON[key].modifiedDate),
                    m('span.mdl-chip', m('span.mdl-chip__text', Data.titles.titlesJSON[key].category))


                ),
                m('.mdl-card__actions mdl-card--border',
                    m('a.mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect', {
                        onclick: function() {
                            currentIdx = Data.titles.titlesJSON[key].id;
                            // m.mount(document.body, blogComponent)
                            m.route.set("/entry/" + currentIdx)
                        }

                    }, 'View')
                )
            ):m('')
            
        }) : m('', loader)

    }
}
var sideBar = {
    view: function() {
        return m('.sideBar', m(categoriesComponent))
    }

}
var blogEntry = {
    oninit: function(vnode) {
        currentIdx = vnode.attrs.id

        Data.post.fetch().then(function() {
            console.log("blog entry retrieved")
        })

    },
    view: function(vnode) {
        return (blogResponse != "") ? m("main.blog", m('',
            m('.parallax',
                m('button.mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored', {
                    onclick: function() {
                        m.route.set('/')

                    }

                }, m('i.material-icons', 'keyboard_arrow_left')), m("h1", { class: "title" }, blogResponse.title)),
            m(".", m.trust(markdown.toHTML(blogResponse.body)))
        )) : m('')
    }
}


var mainView = {

    view: function() {
        return [m(header), m('.wrapper', m(sideBar), m('boxes', m(titlesCards)))]
    }
}
m.route.prefix("#")
m.route(blog, "/", {
    "/": mainView,
    "/entry/:id": blogEntry
})