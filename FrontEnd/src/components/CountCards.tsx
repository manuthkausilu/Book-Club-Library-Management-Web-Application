import React from "react";
import { MdLibraryBooks, MdPeople, MdShoppingCart } from "react-icons/md";

interface CountCardsProps {
  bookCount: number;
  readerCount: number;
  lendingCount: number;
}

const cardData = [
  {
    label: "Books",
    icon: <MdLibraryBooks className="w-8 h-8 text-indigo-600" />,
    bg: "bg-indigo-50",
    key: "bookCount",
  },
  {
    label: "Readers",
    icon: <MdPeople className="w-8 h-8 text-green-600" />,
    bg: "bg-green-50",
    key: "readerCount",
  },
  {
    label: "Lendings",
    icon: <MdShoppingCart className="w-8 h-8 text-yellow-600" />,
    bg: "bg-yellow-50",
    key: "lendingCount",
  },
];

const CountCards: React.FC<CountCardsProps> = ({ bookCount, readerCount, lendingCount }) => {
  const counts: Record<string, number> = { bookCount, readerCount, lendingCount };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {cardData.map((card) => (
        <div key={card.key} className={`flex items-center p-6 rounded-lg shadow ${card.bg}`}>
          <div className="mr-4">{card.icon}</div>
          <div>
            <div className="text-2xl font-bold">{counts[card.key]}</div>
            <div className="text-gray-700 text-sm">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountCards;
