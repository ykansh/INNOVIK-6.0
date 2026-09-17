import { NextResponse } from 'next/server';
import type { CivicIssue } from '@/lib/supabase';

// Define the global variable type to avoid TS errors
declare global {
  var __cvq_issues: CivicIssue[] | undefined;
}

// Fallback initial data
const fallbackIssues: CivicIssue[] = [
  {
    id: "1",
    ticket_id: "CIV-ISS-1042",
    title: "Deep Pothole on Main St",
    category: "Roads & Pavement",
    location: "42 Main Street, Downtown",
    status: "In Progress",
    severity: "High",
    department: "Road Maintenance",
    image_url: "/sequence/frame_25.jpg",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    latitude: 22.7196,
    longitude: 75.8577,
  },
  {
    id: "2",
    ticket_id: "CIV-ISS-1021",
    title: "Broken Streetlight",
    category: "Electrical",
    location: "Oakwood Avenue & 4th Cross",
    status: "Resolved",
    severity: "Medium",
    department: "Electrical Dept",
    image_url: "/sequence/frame_10.jpg",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    latitude: 22.7210,
    longitude: 75.8600,
  },
  {
    id: "3",
    ticket_id: "CIV-ISS-1045",
    title: "Fallen Tree Branch",
    category: "Environment",
    location: "River Park North Entrance",
    status: "Under Review",
    severity: "Medium",
    department: "Parks & Recreation",
    image_url: "/sequence/frame_5.jpg",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    latitude: 22.7150,
    longitude: 75.8550,
  },
  {
    id: "5",
    ticket_id: "CIV-ISS-1090",
    title: "Fallen Electric Wire",
    category: "Electrical",
    location: "Station Road, Platform 1 Exit",
    status: "Assigned",
    severity: "Critical",
    department: "Electrical Dept",
    image_url: "/sequence/frame_25.jpg",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    latitude: 22.7180,
    longitude: 75.8500,
  }
];

// Initialize global store to survive Next.js hot reloads during dev
if (!global.__cvq_issues) {
  global.__cvq_issues = [...fallbackIssues];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const reporterId = searchParams.get('reporterId');
  const department = searchParams.get('department');
  const id = searchParams.get('id');

  let issues = global.__cvq_issues || [];

  if (id) {
    const issue = issues.find(i => i.id === id || i.ticket_id === id);
    if (issue) return NextResponse.json(issue);
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  if (status && status !== 'All') {
    issues = issues.filter(i => i.status.toLowerCase() === status.toLowerCase());
  }
  if (reporterId) {
    issues = issues.filter(i => i.reporter_id === reporterId);
  }
  if (department) {
    issues = issues.filter(i => i.department === department);
  }

  // Sort by created_at desc
  issues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json(issues);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newIssue = body as CivicIssue;
    
    if (!global.__cvq_issues) {
      global.__cvq_issues = [];
    }
    
    global.__cvq_issues = [newIssue, ...global.__cvq_issues];
    
    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, resolution_note, resolved_at } = body;

    if (!global.__cvq_issues) return NextResponse.json({ error: "No issues store" }, { status: 500 });

    const index = global.__cvq_issues.findIndex(i => i.id === id || i.ticket_id === id);
    if (index === -1) return NextResponse.json({ error: "Issue not found" }, { status: 404 });

    global.__cvq_issues[index] = {
      ...global.__cvq_issues[index],
      status: status || global.__cvq_issues[index].status,
      resolution_note: resolution_note !== undefined ? resolution_note : global.__cvq_issues[index].resolution_note,
      updated_at: new Date().toISOString(),
      ...(resolved_at && { resolved_at })
    };

    return NextResponse.json(global.__cvq_issues[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}
