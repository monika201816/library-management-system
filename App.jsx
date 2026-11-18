
import React, { useEffect, useState } from "react";
import { searchBooks } from "./services/bookApi";
import { Book, Users, Library, Search, Plus, Trash2 } from "lucide-react";

const initialBooks = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "Wings of Fire", author: "A.P.J. Abdul Kalam" },
  { id: 3, title: "Harry Potter", author: "J.K. Rowling" }
];

export default function App() {
  const [books, setBooks] = useState(() =>
    JSON.parse(localStorage.getItem("libraryBooks") || "null") || initialBooks
  );
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  const addBook = () => {
    if (!title.trim() || !author.trim()) return;

    setBooks([...books, {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim()
    }]);

    setTitle("");
    setAuthor("");
  };

  const deleteBook = id => {
    setBooks(books.filter(book => book.id !== id));
  };

  const findBooks = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      setResults(await searchBooks(query));
    } catch {
      setError("Could not connect to the book service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>📚 LibraryPro</h2>
        <p>Dashboard</p>
        <p>Books</p>
        <p>Members</p>
        <p>Settings</p>
      </aside>

      <main>
        <header>
          <div>
            <h1>Library Dashboard</h1>
            <p>Welcome back, Librarian!</p>
          </div>
        </header>

        <section className="stats">
          <div className="card">
            <Book />
            <p>Total Books</p>
            <h2>{books.length}</h2>
          </div>
          <div className="card">
            <Users />
            <p>Members</p>
            <h2>120</h2>
          </div>
          <div className="card">
            <Library />
            <p>Issued Books</p>
            <h2>35</h2>
          </div>
        </section>

        <section className="panel">
          <h2>Add a Book</h2>
          <div className="form">
            <input placeholder="Book title" value={title}
              onChange={e => setTitle(e.target.value)} />
            <input placeholder="Author name" value={author}
              onChange={e => setAuthor(e.target.value)} />
            <button onClick={addBook}><Plus size={16}/> Add Book</button>
          </div>
        </section>

        <section className="panel">
          <h2>Available Books</h2>
          {books.map(book => (
            <div className="book" key={book.id}>
              <div>
                <b>{book.title}</b>
                <p>Author: {book.author}</p>
              </div>
              <button className="delete" onClick={() => deleteBook(book.id)}>
                <Trash2 size={16}/> Delete
              </button>
            </div>
          ))}
          {!books.length && <p>No books available.</p>}
        </section>

        <section className="panel">
          <h2>Search Open Library</h2>
          <form className="form" onSubmit={findBooks}>
            <input placeholder="Search books or authors"
              value={query} onChange={e => setQuery(e.target.value)} />
            <button disabled={loading}>
              <Search size={16}/> {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          {results.map(book => (
            <div className="book" key={book.id}>
              <div>
                <b>{book.title}</b>
                <p>{book.author} · {book.year}</p>
              </div>
              <button onClick={() => {
                if (!books.some(b => b.title === book.title)) {
                  setBooks([...books, {
                    id: crypto.randomUUID(),
                    title: book.title,
                    author: book.author
                  }]);
                }
              }}>Add</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
v