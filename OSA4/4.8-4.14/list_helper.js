const dummy = (blogs) => {
    return 1;
  };
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  };
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0]);
  };
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;
    const authors = {};
    blogs.forEach(blog => {
      authors[blog.author] = (authors[blog.author] || 0) + 1;
    });
    const author = Object.keys(authors).reduce((a, b) => (authors[a] > authors[b] ? a : b));
    return { author, blogs: authors[author] };
  };
  
  const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;
    const authors = {};
    blogs.forEach(blog => {
      authors[blog.author] = (authors[blog.author] || 0) + blog.likes;
    });
    const author = Object.keys(authors).reduce((a, b) => (authors[a] > authors[b] ? a : b));
    return { author, likes: authors[author] };
  };
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  };
  