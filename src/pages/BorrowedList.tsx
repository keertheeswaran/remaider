import type { Books } from "../types/book";
import "../assets/css/BorrowedList.css";

interface BorrowedListProps {
  books: Books[];
  onReturn: (book: Books) => void;
}

function BorrowedList({ books, onReturn }: BorrowedListProps) {
  return (
    <div className="borrowed-container">
      <div className="borrowed-wrapper">
        {/* Header */}
        <div className="borrowed-header">
          <h1>My Borrowed Books</h1>
          <p>Manage your borrowed collection</p>
        </div>

        {/* Stats Card */}
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-icon">📖</div>
            <div className="stat-info">
              <div className="stat-number">{books.length}</div>
              <div className="stat-label">Books Borrowed</div>
            </div>
          </div>
        </div>

        {/* Books List or Empty State */}
        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">No books borrowed yet</h3>
            <p className="empty-text">
              Start exploring our library collection and borrow your first book!
            </p>
          </div>
        ) : (
          <div className="borrowed-grid">
            {books.map((book) => (
              <div key={book.id} className="borrowed-card">
                <div className="borrowed-card-accent"></div>

                <div className="borrowed-card-body">
                  <div className="borrowed-book-header">
                    <div className="borrowed-icon-wrapper">
                      <span className="borrowed-book-icon">📖</span>
                    </div>
                    <div className="borrowed-book-info">
                      <h3 className="borrowed-book-title">{book.title}</h3>
                      {book.author && (
                        <p className="borrowed-book-author">by {book.author}</p>
                      )}
                    </div>
                  </div>

                  {/* Book Meta */}
                  <div className="borrowed-book-meta">
                    {book.genre && (
                      <span className="borrowed-genre-badge">{book.genre}</span>
                    )}
                    {book.year && (
                      <span className="borrowed-year-badge">{book.year}</span>
                    )}
                    <span className="borrowed-status-badge">
                      <span className="status-dot"></span>
                      Borrowed
                    </span>
                  </div>

                  {/* Book Footer */}
                  <div className="borrowed-book-footer">
                    <button
                      className="return-btn"
                      onClick={() => onReturn(book)}
                    >
                      <span>↩️</span> Return Book
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

export default BorrowedList;
