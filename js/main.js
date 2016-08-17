'use strict'
;(function($) {

  $(function pageReady() {
    $('#search-submit').click(submitSearch)
    $('#search-query').focus()
    $('.my-devices-toggle').click(toggleMyDevicesPane)
    

    let timeout 
    $('#search-query').keyup(e => {
      clearTimeout(timeout)
      timeout = setTimeout(submitSearch, 300)
    })

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


  function toggleMyDevicesPane() {
    $('.my-devices-open').slideToggle(400, () => {
      $('.my-devices-open').is(':visible') 
        ? $('.my-devices-arrows').text('\u25BC')
        : $('.my-devices-arrows').text('\u25B2')
    })
  }

  function removeFromMyDevices(event) {
    let device = $(event.target).parent().next().text()
    //console.log('clicked remove `x` for ', device)
    myDevices.removeDevice(device) 
    let resultNames = $('.deviceWrap').each((idx, el) => {
      if ($(el).text().trim() === device)
        $(el).removeClass('ownedDevice')
    })
    //console.log(resultNames)
    updateViews()
  }


  function deviceClicked(event) {
    let curTarget = $(event.currentTarget)
    let deviceName = curTarget.text()
    //console.log('Clicked button:', deviceName)
    $(this).toggleClass('ownedDevice')
    if (myDevices.contains(deviceName))
      myDevices.removeDevice(deviceName)
    else {
      let numDevices = myDevices.getDevices().length
      myDevices.addDevice(deviceName)
      if (numDevices === 0) {
        toggleMyDevicesPane()

      }
    }
    updateViews()
  }


  updateViews.register = (fn) => updateViews.views.push(fn)
  updateViews.views = []
  function updateViews() {
    //console.log('Running update functions')
    let devices = myDevices.getDevices()
    updateViews.views.forEach(viewFn => viewFn(devices))
  }


  function submitSearch() {
    let query = $('#search-query').val()
    //console.log('query:', query)
    let resultsItr = searchAPI(query)
    fillResults.shown = 0
    fillResults(resultsItr)
  }


  fillResults.shown = 0
  function fillResults(resItr) {
    resItr.next().value.then((apiRes) => {
      if (fillResults.shown === 0)
        $('#results').empty()
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
      $('html, body').animate({ scrollTop: $(document).height() }, 1000);
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


  function urlify(el) {
    return 'http://www.ifixit.com/device/' + el.trim().replace(/\s/, '_')
  }


})(jQuery)



