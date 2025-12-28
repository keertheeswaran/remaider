import { useState } from "react";
import type { Books } from "../types/book";
import "../assets/css/Library.css";
import FilterPage from "../components/FilterPage";
import dammy from "../assets/img/dammy.svg";
interface LibraryProps {
  books: Books[];
  onBorrow: (book: Books) => void;
}

function Library({ books, onBorrow }: LibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState<"title" | "author" | "copies">("title");

  // FILTER + SORT
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === "all" || book.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author")
        return (a.author || "").localeCompare(b.author || "");
      return b.copies - a.copies;
    });

  return (
    <div className="library-container">
      <div className="library-wrapper">
        {/* Header */}
        <div className="library-header">
          <h1>Library Collection</h1>
          <p>Discover and borrow from our extensive collection</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <span className="filter-icon">🔍</span>
            <h3>Filter & Search</h3>
          </div>

          <div className="filters-grid">
            <div className="filter-item">
              <label className="filter-label">Search Books</label>
              <div className="search-wrapper">
                <span className="search-icon">🔎</span>
                <input
                  className="search-input"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-item">
              <label className="filter-label">Genre</label>
              <FilterPage
                books={books}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
              />
            </div>

            <div className="filter-item">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "title" | "author" | "copies")
                }
              >
                <option value="title">📖 Title (A-Z)</option>
                <option value="author">✍️ Author (A-Z)</option>
                <option value="copies">📊 Availability</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <span className="results-badge">
            {filteredBooks.length} of {books.length} books
          </span>
        </div>

        {/* Books Grid or Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">No books found</h3>
            <p className="empty-text">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-card-accent"></div>

                <div className="book-card-body">
                  <div className="book-header">
                    <div className="book-image-wrapper">
                      <img
                        src={
                          book.image && book.image.trim() !== ""
                            ? book.image
                            : dammy
                        }
                        alt={book.title}
                        className="book-image"
                        onError={(e) => {
                          e.currentTarget.src = dammy;
                        }}
                      />
                    </div>

                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      {book.author && (
                        <p className="book-author">by {book.author}</p>
                      )}
                    </div>
                  </div>

                  <div className="book-meta">
                    {book.genre && (
                      <span className="book-genre-badge">{book.genre}</span>
                    )}
                    {book.year && (
                      <span className="book-year-badge">{book.year}</span>
                    )}
                  </div>

                  <div className="book-footer">
                    <div className="book-availability">
                      <span
                        className={`copies-badge ${
                          book.copies > 5
                            ? "high"
                            : book.copies > 0
                            ? "medium"
                            : "low"
                        }`}
                      >
                        <span className="copies-number">{book.copies}</span>
                        <span className="copies-text">
                          {book.copies === 1 ? "copy" : "copies"}
                        </span>
                      </span>
                    </div>

                    <button
                      className={`borrow-btn ${
                        book.copies === 0 ? "disabled" : ""
                      }`}
                      disabled={book.copies === 0}
                      onClick={() => onBorrow(book)}
                    >
                      {book.copies > 0 ? (
                        <>
                          <span>📚</span> Borrow
                        </>
                      ) : (
                        <>
                          <span>🔒</span> Unavailable
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;
