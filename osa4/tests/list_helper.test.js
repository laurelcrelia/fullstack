const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithoutBlogs = []

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
  },
  {
    _id: '4a422aa71b54a676234d17f8',
    title: 'Testiblogi 4',
    author: 'Cecilia',
    url: 'http://www.ceciliantoinenblogi.fi',
    likes: 3,
    __v: 0
  }
]

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
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
    assert.strictEqual(result, 9)
  })
})

describe('favorite blog', () => {
  test('is calculated right when no blogs', () => {
    const result = listHelper.favoriteBlog(listWithoutBlogs)
    assert.strictEqual(result, null)
  })
  test('is calculated right when one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepEqual(result,  {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })
  test('returns first of the favorite blogs when there are multiple with same amount of likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    assert.deepEqual(result,  {
      title: 'Testiblogi 3',
      author: 'Cecilia',
      likes: 3,
    })
  })
})

describe('most blogs', () => {
  test('is calculated right when no blogs', () => {
    const result = listHelper.mostBlogs(listWithoutBlogs)
    assert.strictEqual(result, null)
  })
  test('is calculated right when one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepEqual(result,  {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })
  test('is calculated right when many blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    assert.deepEqual(result,  {
      author: 'Cecilia',
      blogs: 2,
    })
  })
})