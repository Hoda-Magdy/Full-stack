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

const BlogForm = ({ addBlog, title, setTitle, author, setAuthor, url, setUrl }) => (
  <form onSubmit={addBlog}>
    <div>
      Title: <input value={title} onChange={({ target }) => setTitle(target.value)} />
    </div>
    <div>
      Author: <input value={author} onChange={({ target }) => setAuthor(target.value)} />
    </div>
    <div>
      URL: <input value={url} onChange={({ target }) => setUrl(target.value)} />
    </div>
    <button type="submit">Add Blog</button>
  </form>
);

const Blog = ({ blog }) => (
  <li>
    {blog.title} by {blog.author}
  </li>
);

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
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

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      setTitle('');
      setAuthor('');
      setUrl('');
      setMessage(`New blog "${title}" by ${author} added`);
      setMessageType('success');
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage('Error adding blog');
      setMessageType('error');
      setTimeout(() => setMessage(null), 5000);
    }
  };

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
          <BlogForm
            addBlog={addBlog} title={title} setTitle={setTitle}
            author={author} setAuthor={setAuthor} url={url} setUrl={setUrl}
          />
          <ul>
            {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;