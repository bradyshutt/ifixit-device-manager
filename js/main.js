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
    $('.my-devices-toggle').click((event) => {
      $('.my-devices-open').slideToggle(400, () => {
        $('.my-devices-open').is(':visible') 
          ? $('.my-devices-arrows').text('\u25BC')
          : $('.my-devices-arrows').text('\u25B2')
      })
    })
    //$('.devicesRow').click(removeFromMyDevices)

    updateViews.register((devices) => {
      $('#my-devices').html(devices.map((el) => {
        let row = $(
          '<tr class="devicesRow"><td class="remove"><a>x</a></td>' +
          '<td class="name"><span><a href="' + urlify(el) + '">' + 
          el + '</a></span></td></tr>')
        row.find('a').click(removeFromMyDevices)
        return row
      }))
    })

    updateViews.register((devices) => {
      $('.my-devices-title').text('My Devices (' + devices.length + ')')
    })

    updateViews()
  })

  function urlify(el) {
    return 'http://www.ifixit.com/device/' + el.trim().replace(/\s/, '_')
  }

  function removeFromMyDevices(event) {
    let device = $(event.target).parent().next().text()
    console.log('clicked remove `x` for ', device)
    myDevices.removeDevice(device) 
    let resultNames = $('.deviceWrap').each((idx, el) => {
      if ($(el).text().trim() === device) {
        $(el).removeClass('ownedDevice')
      }

    })
    console.log(resultNames)

    updateViews()
  }

  function deviceClicked(event) {
    //if (this !== event.target) return //curTarget.hasClass('deviceWrap')) return true
    let curTarget = $(event.currentTarget)
    let deviceName = curTarget.text()
    console.log('Clicked button:', deviceName)
    $(this).toggleClass('ownedDevice')
    //target.css('backgroundColor', '#33AA33')

    if (myDevices.contains(deviceName))
      myDevices.removeDevice(deviceName)
    else
      myDevices.addDevice(deviceName)
    updateViews()
  }

  updateViews.register = (fn) => updateViews.views.push(fn)
  updateViews.views = []
  function updateViews() {
    console.log('Running update functions')
    let devices = myDevices.getDevices()
    updateViews.views.forEach(viewFn => viewFn(devices))
  }

  function submitSearch() {
    let query = $('#search-query').val()
    console.log('query:', query)
    let resultsItr = searchAPI(query)
    $('#results').empty()
    fillResults.shown = 0

    fillResults(resultsItr)
  }

  fillResults.shown = 0
  function fillResults(resItr) {
    resItr.next().value.then((apiRes) => {
      $('.showMoreButton').remove() 
      let results = apiRes.results.map(device => {
        //let title = device['display_title']
        let title = device['title']
        /* Some "Device" wiki pages have the term 'repaire' at the end?? 
         * If so, remove that word from the name lists */
        if (title.slice(-6).toLowerCase().trim() === 'repair')
          title = title.slice(0, -7)
        let el = 
          $('<div class="deviceWrap"><span>' + title + '</span></div>')
            .click(deviceClicked)
        if (myDevices.contains(title))
          el.addClass('ownedDevice')
        return el
      })
      $('#results-meta').text('(' + apiRes.totalResults + ' results)')
      $('#results').append(results)
      fillResults.shown += 20
      if ((apiRes.totalResults - fillResults.shown)  > 0) {
        $('<button>')
          .text('Show More')
          .addClass('showMoreButton')
          .click(event => fillResults(resItr))
          .appendTo('.load-more-wrapper')
      }
      scrollTo(0, document.body.scrollHeight)
    })
  }

  function *searchAPI(query) {
    let offset = 0
    while (true) {
      yield new Promise((resolve, reject) => { 
        let url 
          = 'https://www.ifixit.com/api/2.0/search/' 
          + encodeURIComponent(query) 
          + '?filter=category'
          + '&offset=' + offset
        resolve(jQuery.getJSON(url))
      })
      offset += 20
    }
  }

  function searchAPIBackup(query) {
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



