/* myDevices.js 
 *  
 * Keeps track of a list of devices that a user owns. 
 * Relies on HTML5 LocalStorage to save a list of 
 * user-owned devices across page-reloads/browser restarts. 
 * */

'use strict'
;(function(global, jQuery) {

  let savedDevices = []
  let views = []

  global.myDevices = {

    loadDevices() {
      console.log('Loading saved devices from local storage')
      if (typeof Storage !== 'undefined') {
        savedDevices = savedDevices || []
        let loaded = JSON.parse(localStorage.getItem('myDevices')) || null
        if (loaded)
          loaded.forEach(el => { if (!savedDevices[el]) savedDevices.push(el) })
      } else throw new Error('Local storage unavailable.')
    }, 

    saveDevices() {
      console.log('Saving devices to local storage')
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('myDevices', JSON.stringify(savedDevices))
      } else throw new Error('Local storage unavailable.')
    },

    registerView(view) { 
      if (!views[view]) views.push(view) 
    },

    updateViews() {
      console.log('Updating view')
      let elements = savedDevices.map((el) => 
          '<tr><td class="remove"><a>x</a></td>' + 
          '<td class="name"><span>' + el + '</span></td></tr>').join('')
      views.forEach((view) => { $(view).html(elements) })
    },

    addDevice(device) {
      device = device.trim()
      console.log('Adding', device, 'to saved devices')
      if (!savedDevices[device]) {
        savedDevices.push(device)
        myDevices.saveDevices()
        myDevices.updateViews()
      }
    },

    removeDevice(device) {
      device = device.trim()
      console.log(`Removing ${device} from collection`)
      let idx
      console.log('|' + device + '|')
      console.log(myDevices.contains(device))
      console.log(savedDevices)
      if ((idx = savedDevices.indexOf(device)) > -1) {
        savedDevices.splice(idx, 1)
        myDevices.saveDevices()
        myDevices.updateViews()
      }
      else throw new Error('Attempted to remove ' + device + ' from collection.')
    },

    contains(device) {
      return (savedDevices.indexOf(device.trim()) > -1)
    },


    logStorage() {
      console.log('Local Storage Contents:')
      console.log(JSON.parse(localStorage.getItem('myDevices')))
    },

    logSaved() {
      console.log('Saved Devices:')
      console.log(savedDevices)
    },

    clearLocalStorage() {
      console.log('Clearing local storage.')
      localStorage.removeItem('myDevices')
    }
  }

})(window, jQuery)


