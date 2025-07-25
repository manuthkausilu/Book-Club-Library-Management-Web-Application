import { useEffect, useState } from "react";
import CountCards from "../components/CountCards";
import { getBookCountWithCopies } from "../services/bookService";
import { getLendingCount } from "../services/lendingService";
import { getAllReaders } from "../services/readerService";

function Dashboard() {
  const [bookCount, setBookCount] = useState(0);
  const [readerCount, setReaderCount] = useState(0);
  const [lendingCount, setLendingCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [bookRes, readerRes, lendingRes] = await Promise.all([
          getBookCountWithCopies(),
          getAllReaders(),
          getLendingCount(),
        ]);
        setBookCount(bookRes.count);
        setReaderCount(readerRes.length);
        setLendingCount(lendingRes.count);
      } catch {
        // handle error if needed
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      <CountCards
        bookCount={bookCount}
        readerCount={readerCount}
        lendingCount={lendingCount}
      />
      {/* ...existing code... */}
    </div>
  );
}

export default Dashboard;