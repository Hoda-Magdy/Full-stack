const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.delete(`/api/blogs/${validNonexistingId}`).expect(404)
    })
  })

  describe('updating a blog', () => {
    test('succeeds in updating likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = { likes: blogToUpdate.likes + 1 }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.put(`/api/blogs/${validNonexistingId}`).send({ likes: 5 }).expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
