'use strict'
;(function(global) {

  let views = []

  function registerView(view) {
  }

  function addDevice(device) {

  }

  function removeDevice(device) {
    console.log('Remove device', device)
    
  }

  function loadDevices() {
    console.log('Load devices from cache')
    
  }

  function saveDevices() {
    console.log('Save devices to the users cache')
    
  }

  global.myDevices = {
    'registerView': registerView,
    'addDevice': addDevice,
    'removeDevice': removeDevice,
    'loadDevices': loadDevices,
    'saveDevices': saveDevices,
  }

})(window)


