const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body;
    const user = request.user;
    
    if (!user) {
        return response.status(401).json({ error: 'Token missing or invalid' });
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    
    response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' });
    }

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes },
        { new: true }
    );

    response.json(updatedBlog);
});

module.exports = blogsRouter;