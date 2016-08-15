'use strict'


let p = jQuery.getJSON('https://www.ifixit.com/api/2.0/wikis/CATEGORY?display=titles&limit=10000&offset=1&pretty')
p.then((data) => {
  console.log(data.length)
  console.log(data[Math.floor(Math.random() * 1000)])
})



/*
let calls = 0

function *pullCategories() {
  let limit = 200
  let offset = 200*32
  let numResults

  do {
    calls++
    numResults = yield jQuery.getJSON(`https://www.ifixit.com/api/2.0/categories/all?limit=${limit}&offset=${offset}`)
    offset += numResults
  } while (numResults === 200)
}

let puller = pullCategories()



puller.next().value
  .then((data) => {
    console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
    return puller.next(data.length).value
  })
//  .then((data) => {
//    console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//    return puller.next(data.length).value
//  })
//  .then((data) => {
//    console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//    return puller.next(data.length).value
//  })
//  .then((data) => {
//    console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//    return puller.next(data.length).value
//  })
//  .then((data) => {
//    console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//    return puller.next(data.length).value
//  })


//
//'use strict'
//
//let calls = 0
//
//function *pullCategories() {
//  let limit = 200
//  let offset = 0
//
//  while (limit > 0) {
//    calls++
//    offset += yield jQuery.getJSON(`https://www.ifixit.com/api/2.0/categories/all?limit=${limit}&offset=${offset}`)
//  }
//}
//
//let puller = pullCategories()
//let next = puller.next()
//
//next.value.done((data) => {
//  console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//  puller.next(data.length).value.done((data) => {
//    console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//    puller.next(data.length).value.done((data) => {
//      console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//      puller.next(data.length).value.done((data) => {
//        console.log(`call #${calls}; length: ${data.length}; first: ${data[0]}`)
//        next = puller.next(data.length)
//      })
//    })
//  })
//})
//






*/
