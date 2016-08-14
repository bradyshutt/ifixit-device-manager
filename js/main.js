'use strict'
;(function() {

  $(function pageReady() {
    $('#search-submit').click(submitSearch).click()
    $('#search-query').focus()

    $('#my-devices').sortable({
      items: 'li',
      scroll: false,
      over: (e, ui) => {
        console.log('over')
        console.log('origin:', ui.item.data('origin'))

        let self = $('#my-devices')
        if (ui.sender !== e.target) {
          self.innerHeight(self.innerHeight() + ui.item.outerHeight()) 
        }
      },
      out: (e, ui) => {
        console.log('out')
        $('#my-devices').innerHeight(
          $('#my-devices').innerHeight() - ui.item.outerHeight()) 
      },
      receive: (e, ui) => { 
        console.log('receive')
        let self = $('#my-devices')
        self.innerHeight(self.innerHeight() + ui.item.outerHeight()) 
        console.log('item: ', ui.item.data())
        ui.item.data('origin', 'my-devices')
        console.log('item: ', ui.item.data())
//        $('#my-devices').innerHeight(
//          $('#my-devices').innerHeight() + ui.item.outerHeight()) 
        //$(ui.item).draggable

      },
      activate: () => {console.log('dev.activate')},
      connectWith: '.devices',
    })
  })

  function submitSearch() {
    let query = $('#search-query').val()
    console.log('query:', query)
    searchAPI(query).then((apiRes) => {
      $('#results-meta').text('(' + apiRes.totalResults + ' results)')
      let results = apiRes.results.map(device =>
        $('<li>')
          .text(device.title)
          .draggable({
            scope: 'my-devices',
            scroll: false,
            containment: 'window',
            revert: 'invalid',
            helper: 'clone',
            zindex: 99,
            connectToSortable: '.devices',
          }) 
      )
      //$('#results-meta').text('Showing ' + apiRes.totalResults + ' results')
      let numShowing = apiRes.moreResults ? 20 : apiRes.totalResults
      $('#results').html(results)
    })
  }


  function searchAPI(query) {
    return new Promise((resolve, reject) => { 
      let url 
        = 'https://www.ifixit.com/api/2.0/search/' 
        + encodeURIComponent(query) 
        + '?filter=category'
      jQuery.getJSON(url, resolve)
    })
  }


  getTemplate.memos = { }
  function getTemplate(name) {
    return new Promise((resolve, reject) => {
      if (getTemplate.memos[name]) {
        console.log('Retrieving template from memo')
        resolve(getTemplate.memos[name])
      } else {
        jQuery.get('/templates/' + name + '.html', null, (template) => {
          console.log('Memoizing the template.')
          getTemplate.memos[name] = template
          resolve(template)
        }, 'text')
      }
    })
  }



})()



