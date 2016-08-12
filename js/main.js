'use strict'
;(function($, Mustache) {

  $(function pageReady() {
    $('#search-submit').click(submitSearch)
    
  })


  function submitSearch() {
    let query = $('#search-query').val()
    console.log('query:', query)
    searchAPI(query).then((apiRes) => {
      let results = apiRes.results.map(device => `<li>${device.title}</li>`)
      //$('#results-meta').text('Showing ' + apiRes.totalResults + ' results')
      let numShowing = apiRes.moreResults ? 20 : apiRes.totalResults
      $('#results-meta')
        .text('(' + apiRes.totalResults + ' results)')
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



})(jQuery, Mustache)



