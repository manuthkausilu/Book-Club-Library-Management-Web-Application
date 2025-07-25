import React, { useEffect, useState } from "react";
import { getOverdueLendings, getOverdueCount, sendOverdueNotification } from "../services/lendingService";
import type { Lending } from "../types/Lending";
import toast from "react-hot-toast";
import OverdueTable from "../components/tables/OverdueTable";

const OverduePage: React.FC = () => {
  const [overdueLendings, setOverdueLendings] = useState<Lending[]>([]);
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [lendings, countRes] = await Promise.all([
        getOverdueLendings(),
        getOverdueCount(),
      ]);
      setOverdueLendings(lendings);
      setOverdueCount(countRes.overdueCount);
    } catch {
      toast.error("Failed to fetch overdue data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendMail = async (lendingId: string) => {
    setSendingId(lendingId);
    try {
      await sendOverdueNotification(lendingId);
      toast.success("Notification sent!");
    } catch {
      toast.error("Failed to send notification");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Overdue Lendings</h1>
        <div className="mb-6">
          <span className="text-lg font-semibold text-red-600">
            Overdue Count: {overdueCount}
          </span>
        </div>
        <OverdueTable lendings={overdueLendings} sendingId={sendingId} onSendMail={handleSendMail} />
      </div>
    </div>
  );
};


export default OverduePage;
