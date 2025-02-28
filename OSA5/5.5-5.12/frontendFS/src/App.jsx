import { useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';

const Notification = ({ message, type }) => {
  if (!message) return null;
  return <div className={type}>{message}</div>;
};

const LoginForm = ({ username, password, handleLogin, setUsername, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      Username: <input value={username} onChange={({ target }) => setUsername(target.value)} />
    </div>
    <div>
      Password: <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
    </div>
    <button type="submit">Login</button>
  </form>
);

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>Title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
      <div>Author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
      <div>URL: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
      <button type="submit">Add Blog</button>
    </form>
  );
};

const BlogFormTogglable = ({ addBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div>
      {visible ? (
        <div>
          <BlogForm addBlog={addBlog} />
          <button onClick={toggleVisibility}>Cancel</button>
        </div>
      ) : (
        <button onClick={toggleVisibility}>Create new blog</button>
      )}
    </div>
  );
};

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    await updateBlog(updatedBlog);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      await deleteBlog(blog.id);
    }
  };

  return (
    <div style={{ border: 'solid', borderWidth: 1, padding: 10, marginBottom: 5 }}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'Hide' : 'View'}</button>
      </div>
      {visible && (
        <div>
          <div>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></div>
          <div>Likes: {blog.likes}</div>
          <div>Added by: {blog.user.name}</div>
          <button onClick={handleLike}>Like</button>
          {user.id === blog.user.id && <button onClick={handleDelete}>Delete</button>}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage('Wrong username or password');
      setMessageType('error');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser');
    setUser(null);
  };

  const addBlog = async ({ title, author, url }) => {
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      setMessage(`New blog "${title}" by ${author} added`);
      setMessageType('success');
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage('Error adding blog');
      setMessageType('error');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const updateBlog = async (updatedBlog) => {
    try {
      await blogService.update(updatedBlog);
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} type={messageType} />

      {user === null ? (
        <LoginForm
          username={username} password={password}
          handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword}
        />
      ) : (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
          <h3>Create new</h3>
          <BlogFormTogglable addBlog={addBlog} />
          <ul>
            {sortedBlogs.map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                user={user}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
