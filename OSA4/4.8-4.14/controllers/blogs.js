const express = require('express')
const Blog = require('../models/blog')
const router = express.Router()

// GET all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

// POST a new blog
router.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({ title, author, url, likes: likes || 0 })
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

// DELETE a blog by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const blog = await Blog.findById(id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

// UPDATE a blog (only likes count)
router.put('/:id', async (req, res) => {
  const { likes } = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true, runValidators: true }
  )

  if (!updatedBlog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.json(updatedBlog)
})

module.exports = router
