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
    $('#search-submit').click(submitSearch).click()
    $('#search-query').focus()

    $('#results').click(deviceClicked)
    $('#my-devices').click(myDevicesClicked)

    myDevices.loadDevices()
    myDevices.registerView('#my-devices')
    myDevices.updateViews()
  })


  function myDevicesClicked(event) {
    let target = $(event.target)
    console.log(target)
    if (target.text() === 'x') {
      let device = target.parent().next().text()
      console.log('clicked remove `x` for ', device)
      myDevices.removeDevice(device) 
    }
  }

  /* Catches click event on the container div as it
   * bubbles up, NOT on the targeted 'device div' */
  function deviceClicked(event) {
    let target = $(event.target)
    let deviceName = target.text()
    if (target.children().length > 1) return
    console.log('Clicked button:', deviceName)

    if (myDevices.contains(deviceName)) {
      myDevices.removeDevice(deviceName)
      target.parent().removeClass('ownedDevice')
    } else {
      myDevices.addDevice(deviceName)
      target.parent().addClass('ownedDevice')
    }
  }

  function submitSearch() {
    let query = $('#search-query').val()
    console.log('query:', query)
    let results = searchAPI(query)
    results.then((apiRes) => {
      let results = apiRes.results.map(device => {
        //let title = device['display_title']
        let title = device['title']
        /* Some "Device" pages have the term at the end?? 
         * If so, remove it from these lists */
        if (title.slice(-6).toLowerCase().trim() === 'repair')
          title = title.slice(0, -6)
        let el = $('<div>').html($('<span>').text(title))
        if (myDevices.contains(title))
          el.addClass('ownedDevice')
        return el
      })
      $('#results-meta').text('(' + apiRes.totalResults + ' results)')
      $('#results').html(results)
      if (apiRes.totalResults > 20) {
        $('<button>')
          .text('Show More')
          .addClass('showMoreButton')
          .click(loadNextAPIResults)
          .appendTo('#results')
      }
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

})(jQuery)



