import type { Books } from "../types/book";
import SearchableSelect from "./Ui/SearchableSelect";

interface Props {
  books: Books[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

function FilterPage({ books, selectedGenre, onGenreChange }: Props) {
  const genres = [
    "all",
    ...new Set(books.map((b) => b.genre).filter(Boolean)),
  ] as string[];

  return (
    <SearchableSelect
      options={genres}
      value={selectedGenre}
      placeholder="Select Genre"
      onChange={onGenreChange}
    />
  );
}

export default FilterPage;
