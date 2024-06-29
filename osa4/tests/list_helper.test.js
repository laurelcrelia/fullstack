const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f5',
      title: 'Testiblogi 1',
      author: 'Aapo',
      url: 'http://www.aaponblogi.fi',
      likes: 1,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f6',
      title: 'Testiblogi 2',
      author: 'Bertta',
      url: 'http://www.bertanblogi.fi',
      likes: 2,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f7',
      title: 'Testiblogi 3',
      author: 'Cecilia',
      url: 'http://www.cecilianblogi.fi',
      likes: 3,
      __v: 0
    }
  ]
  test('of empty list is zero', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 6)
  })
})
