import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import Library from "./pages/Library";
import BorrowedList from "./pages/BorrowedList";
import type { Books } from "./types/book";
import { initialBooks } from "./data/initialBooks";
type AuthState = "login" | "otp" | "authenticated";
type DashboardView = "library" | "borrowed";

function App() {
  // Auth States
  const [authState, setAuthState] = useState<AuthState>("login");
  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [library, setLibrary] = useState<Books[]>(initialBooks);

  // Dashboard States
  const [currentView, setCurrentView] = useState<DashboardView>("library");
  const [borrowedBooks, setBorrowedBooks] = useState<Books[]>([]);

  // Auth Handlers
  const handleLogin = (name: string, mobile: string) => {
    setUserName(name);
    setUserMobile(mobile);
    setAuthState("otp");
  };

  const handleOTPVerify = () => {
    setAuthState("authenticated");
  };

  const handleBack = () => {
    setAuthState("login");
    setUserName("");
    setUserMobile("");
  };

  // Book Handlers
  const borrowBook = (book: Books) => {
    if (borrowedBooks.length >= 2) {
      alert("You can borrow only 2 books");
      return;
    }

    const alreadyBorrowed = borrowedBooks.some((b) => b.id === book.id);

    if (alreadyBorrowed) {
      alert("You already borrowed this book");
      return;
    }

    // add book to borrowed list
    setBorrowedBooks([...borrowedBooks, { ...book, copies: 1 }]);

    // update library stock
    setLibrary((prev) =>
      prev
        .map((b) => (b.id === book.id ? { ...b, copies: b.copies - 1 } : b))
        .filter((b) => b.copies > 0)
    );
  };

  const returnBook = (book: Books) => {
    setBorrowedBooks(borrowedBooks.filter((b) => b.id !== book.id));

    setLibrary((prev) => {
      const existingBook = prev.find((b) => b.id === book.id);

      if (existingBook) {
        return prev.map((b) =>
          b.id === book.id ? { ...b, copies: b.copies + 1 } : b
        );
      }

      return [...prev, { ...book, copies: 1 }];
    });
  };
  const handleLogout = () => {
    setAuthState("login");
    setUserName("");
    setUserMobile("");
    setCurrentView("library");
  };

  // Render based on auth state
  if (authState === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (authState === "otp") {
    return (
      <OTPPage
        mobile={userMobile}
        onVerify={handleOTPVerify}
        onBack={handleBack}
      />
    );
  }

  // Dashboard Navigation
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">📚</span>
            <span className="brand-text">Library System</span>
          </div>

          <div className="nav-links">
            <button
              className={`nav-link ${
                currentView === "library" ? "active" : ""
              }`}
              onClick={() => setCurrentView("library")}
            >
              📖 Library
            </button>
            <button
              className={`nav-link ${
                currentView === "borrowed" ? "active" : ""
              }`}
              onClick={() => setCurrentView("borrowed")}
            >
              📚 Borrowed ({borrowedBooks.length})
            </button>
          </div>

          <div className="nav-user">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{userName}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      {currentView === "library" ? (
        <Library books={library} onBorrow={borrowBook} />
      ) : (
        <BorrowedList books={borrowedBooks} onReturn={returnBook} />
      )}
    </div>
  );
}

export default App;
