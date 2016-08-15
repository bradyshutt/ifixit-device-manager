/* myDevices.js *  * Keeps track of a list of devices that a user owns. * Relies on HTML5 LocalStorage. 
 * */

'use strict'
;(function(global, jQuery) {

  let myDevices = []
  let views = []

  function loadDevices() {
    console.log('Loading saved devices from local storage')
    if (typeof Storage !== 'undefined') {
      myDevices = myDevices || []
      let loaded = JSON.parse(localStorage.getItem('myDevices')) || null
      if (loaded)
        loaded.forEach(el => { if (!myDevices[el]) myDevices.push(el) })
    } else throw new Error('Local storage unavailable.')
  }

  function saveDevices() {
    console.log('Saving devices to local storage')
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('myDevices', JSON.stringify(myDevices))
    } else throw new Error('Local storage unavailable.')
  }

  function registerView(view) { if (!views[view]) views.push(view) }

  function updateViews() {
    console.log('Updating view')
    let elements = myDevices.map((el) => 
        '<tr><td class="remove"><a>x</a></td>' + 
        '<td class="name">' + el + '</td></tr>').join('')
    views.forEach((view) => $(view).html(elements))
  }

  function addDevice(device) {
    console.log('Adding', device, 'to saved devices')
    myDevices.push(device)
  }

  function removeDevice(device) {
    console.log(`Removing ${device} from collection`)
    let idx
    if ((idx = myDevices.indexOf(device)) > -1)
      myDevices.splice(idx, 1)
    else throw new Error('Attempted to remove', device, 'from collection.')
  }

  function logStorage() {
    console.log('Local Storage Contents:')
    console.log(JSON.parse(localStorage.getItem('myDevices')))
  }

  function logSaved() {
    console.log('Saved Devices:')
    console.log(myDevices)
  }

  function clearLocalStorage() {
    console.log('Clearing local storage.')
    localStorage.removeItem('myDevices')
  }

  global.myDevices = {
    loadDevices: loadDevices,
    saveDevices: saveDevices,
    registerView: registerView,
    updateViews: updateViews,
    addDevice: addDevice,
    removeDevice: removeDevice,
    logStorage: logStorage,
    logSaved: logSaved,
    clearLocalStorage: clearLocalStorage
  }

})(window, jQuery)


