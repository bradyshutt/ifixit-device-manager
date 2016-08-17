/* myDevices.js 
 *  
 * Keeps track of a list of devices that a user owns. 
 * Relies on HTML5 LocalStorage to save a list of 
 * user-owned devices across page-reloads & browser restarts. 
 *
 * Adds one interface object to global: `myDevices`
 * */

'use strict'
;(function(global) {

  let savedDevices = []

  global.myDevices = {
    load() {
      if (typeof Storage !== 'undefined') {
        savedDevices = savedDevices || []
        let loaded = JSON.parse(localStorage.getItem('myDevices')) || null
        if (loaded) {
          loaded.forEach(el => { 
            if (!savedDevices[el]) savedDevices.push(el) 
          })
        }
      } else throw new Error('Local storage unavailable.')
    }, 

    add(device) {
      device = device.trim()
      if (!savedDevices[device]) {
        savedDevices.push(device)
        save()
      }
    },

    remove(device) {
      device = device.trim()
      let idx
      if ((idx = savedDevices.indexOf(device)) > -1) {
        savedDevices.splice(idx, 1)
        save()
      }
      else throw new Error('Attempted to remove ' + device + ' from collection.')
    },

    contains(device) { return (savedDevices.indexOf(device.trim()) > -1) },
    clearLocalStorage() { localStorage.removeItem('myDevices') },
    getAll() { return savedDevices },
  }


  function save() {
    if (typeof Storage !== 'undefined')
      localStorage.setItem('myDevices', JSON.stringify(savedDevices))
    else 
      throw new Error('Local storage unavailable.')
  }

  function logStorage() {
    console.log('Local Storage Contents:')
    console.log(JSON.parse(localStorage.getItem('myDevices')))
  }

  function logSaved() {
    console.log('Saved Devices:')
    console.log(savedDevices)
  }


  /* Run this when the script is loading load */
  myDevices.load()
})(window)


