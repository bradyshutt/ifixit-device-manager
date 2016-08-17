'use strict'
;(function($) {

  $(function pageReady() {
    $('#search-submit').click(submitSearch)
    $('#search-query').focus()
    $('.my-devices-toggle').click(toggleMyDevicesPanel)

    /* Automatic search after a 300ms delay */
    let timeout 
    $('#search-query').keyup(e => {
      clearTimeout(timeout)
      timeout = setTimeout(submitSearch, 350)
    })

    /* Array of functions to be invoked on each call to views.update */
    views.register([
      /* Recreate the `my devices` panel when it's updated  */
      (devices) => {
        $('#my-devices').html(devices.map((el) => {
          let row = $(
            '<tr class="devicesRow"><td class="remove"><a>x</a></td>' +
            '<td class="name"><span><a href="' + urlify(el) +
            '" target="_blank">' + el + '</a></span></td></tr>')
          row.find('.remove a').click(removeFromMyDevices)
          return row
        }))
      }
      /* Update the # of devices on the `my devices` panel */
      , (devices) => {
        $('.my-devices-title').text('My Devices (' + devices.length + ')')
      }
    ])

    views.update()
  })


  function toggleMyDevicesPanel() {
    $('.my-devices-open').slideToggle(400, () => {
      $('.my-devices-open').is(':visible') 
        ? $('.my-devices-arrows').text('\u25BC')
        : $('.my-devices-arrows').text('\u25B2')
    })
  }


  function removeFromMyDevices(event) {
    let device = $(event.target).parent().next().text()
    myDevices.remove(device) 
    let resultNames = $('.deviceWrap').each((idx, el) => {
      if ($(el).text().trim() === device)
        $(el).removeClass('ownedDevice')
    })
    views.update()
  }


  function resultsDeviceClicked(event) {
    let curTarget = $(event.currentTarget)
    let deviceName = curTarget.text()
    $(this).toggleClass('ownedDevice')
    if (myDevices.contains(deviceName))
      myDevices.remove(deviceName)
    else {
      myDevices.add(deviceName)
      if ($('.my-devices-open').is(':hidden'))
        toggleMyDevicesPanel()
    }
    views.update()
  }


  /* Closure that evaluates to  */
  let views = (() => {
    let views = []
    /* Push `fn` to the views array
     * if `fn` is an array, push each function in the array */
    function register(fn) {
      if (Array.isArray(fn))
        fn.forEach(f => views.push(f))
      else
        views.push(fn)
    }
    /* Each call to `views.update()` will invoke each function in the views 
     * array, with the list of devices as the first argument */
    function update() {
      let devices = myDevices.getAll()
      views.forEach(viewFn => viewFn(devices))
    }
    /* Provide interface. Usage: `views.register(fn)` & `views.update()` */
    return {
      'register': register,
      'update': update
    }
  })()


  function submitSearch() {
    let query = $('#search-query').val()
    /* Don't do anything if the query is empty */
    if (query === '') return
    let resultsItr = searchAPI(query)
    fillResults(resultsItr, 0)
  }


  /* Sequentially fills in the next 'page' of device names
   * `resItr` is the iterator of a generator function instance (*seachAPI),
   *    which yields a promise that will resolve to the next page of results 
   *    once it's asynchronously loaded from the server */
  function fillResults(resItr) {
    resItr.next().value.then((apiRes) => {
      /* Empty the results container if this is a new query */
      if (apiRes.offset === 0) 
        $('#results').empty()
      $('.showMoreButton').remove() 

      /* Build the html formatted results */
      let results = apiRes.results.map(device => {
        let title = device['title']
        /* Some "Device" pages have the term 'repaire' at the end?? */
        if (title.slice(-6).toLowerCase().trim() === 'repair')
          title = title.slice(0, -7)
        let el = $('<div class="deviceWrap"><span>' + title + '</span></div>')
          .click(resultsDeviceClicked)
        if (myDevices.contains(title))
          el.addClass('ownedDevice')
        return el
      })

      $('#results-meta').text('(' + apiRes.totalResults + ' results)')
      $('#results').append(results)

      /* If there're more results, add a button that will display them */
      if (apiRes.moreResults) {
        $('<button>')
          .text('Show More')
          .addClass('showMoreButton')
          .click(event => fillResults(resItr))
          .appendTo('.load-more-wrapper')
      }
      $('html, body').animate({ scrollTop: $(document).height() }, 1000);
    })
  }


  /* Closure that evaluates to the returned function */
  let searchAPI = (function() {
    let prev = null

    /* Becomes the value of `searchAPI`. Returns an iterator instance of the
     * `*searchGenerator`, hidden in the closure of this returned function.
     * This interface function ends old generators (because they would run 
     * forever, otherwise, and they're no longer needed) */
    return function(query) {
      /* If there's generator running, end it */
      if (prev) prev.return('done')
      let itr = searchGenerator(query)
      prev = itr
      return itr
    }

    /* Returns an infinite generator that yields a new promise that, when 
     * resolved, will hold the value of the next page of devices, by 
     * incrementing offset by 20 each time the loop is run. */
    function *searchGenerator(query) {
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
  })()


  function urlify(name) {
    return 'http://www.ifixit.com/device/' + name.trim().replace(/\s/, '_')
  }


})(jQuery)



