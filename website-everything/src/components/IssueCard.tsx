import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface IssueCardProps {
  id: string;
  ticketId: string;
  category: string;
  location: string;
  date: string;
  status: "Open" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed" | string;
  imageUrl: string;
}

export default function IssueCard({ id, ticketId, category, location, date, status, imageUrl }: IssueCardProps) {
  
  const getStatusColor = (statusStr: string) => {
    switch(statusStr) {
      case "Open": return "bg-gray-100 text-gray-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Assigned": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-purple-100 text-purple-800";
      case "Resolved":
      case "Closed": return "bg-[#DCFCE7] text-[#16A34A]";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link href={`/dashboard/issues/${id}`} className="block group">
      <div className="bg-white rounded-2xl border border-[#E5EAE6] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row h-full">
        <div className="h-48 sm:h-auto sm:w-48 bg-gray-200 relative shrink-0">
          <img src={imageUrl || "/sequence/frame_25.jpg"} alt={category} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-[#66706A] tracking-wider uppercase">{ticketId}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#171918] group-hover:text-[#16A34A] transition-colors">{category}</h3>
          </div>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[#66706A]">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
