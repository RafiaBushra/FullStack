const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  expect(listHelper.dummy([])).toBe(1)
})

// const can1 = {
//   flavor: 'grapefruit',
//   ounces: 12,
// }
// const can2 = {
//   flavor: 'grapefruit',
//   ounces: 12,
// }

// describe('the La Croix cans on my desk', () => {
//   test('have all the same properties', () => {
//     expect(can1).toEqual(can2)
//   })
//   test('are not the exact same can', () => {
//     expect(can1).toBe(can2)
//   })
// })