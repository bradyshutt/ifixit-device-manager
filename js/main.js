'use strict'
;(function($) {

  /*
    'Samsung Galaxy S6',
    'Asus Laptop',
    'Moto360',
    'Google Chromebook',
    'Samsung Galaxy Note 10.1',
    'Projector'
  ]
  */

  $(function pageReady() {
    $('#search-submit').click(submitSearch)//.click()
    $('#search-query').focus()

    myDevices.loadDevices()
    myDevices.registerView('#my-devices')
    myDevices.updateViews()
  })

  function submitSearch() {
    let query = $('#search-query').val()
    console.log('query:', query)
    searchAPI(query).then((apiRes) => {
      $('#results-meta').text('(' + apiRes.totalResults + ' results)')
      let results = apiRes.results.map(device => $('<div>').text(device.title))
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
      let urrl = 
        'https://www.ifixit.com/api/2.0/wikis/CATEGORY?display=hierarchy'
      let p = jQuery.getJSON(urrl)
      //p.done((data) => { console.log(data) })

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

})(jQuery)



