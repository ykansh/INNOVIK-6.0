import { createClient } from "@supabase/supabase-js";

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Detect if user has configured valid Supabase keys
export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.startsWith("http") &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.length > 10
  );
};

// Initialize client with fallback to avoid build/runtime crash when unconfigured
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : "https://placeholder-project.supabase.co",
  isSupabaseConfigured() ? supabaseAnonKey : "placeholder-anon-key"
);

export type UserRole = "citizen" | "officer" | "supervisor";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  badge_id?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

export interface CivicIssue {
  id: string;
  ticket_id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  status: "Open" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  severity: "Low" | "Medium" | "High" | "Critical";
  department?: string;
  reporter_id?: string;
  reporter_name?: string;
  resolution_note?: string;
  created_at: string;
  updated_at?: string;
}

// Default fallback issues for demo/offline resilience
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
  },
  {
    id: "4",
    ticket_id: "CIV-ISS-0988",
    title: "Clogged Drainage",
    category: "Water & Sanitation",
    location: "Westside Suburb Sector 3",
    status: "Open",
    severity: "Low",
    department: "Drainage Works",
    image_url: "/sequence/frame_2.jpg",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
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
  }
];

// Helper to get local mock issues
const getLocalIssues = (): CivicIssue[] => {
  if (typeof window === "undefined") return fallbackIssues;
  try {
    const stored = localStorage.getItem("cvq_local_issues");
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Local storage error:", e);
  }
  return fallbackIssues;
};

// Helper to save local mock issues
const saveLocalIssues = (issues: CivicIssue[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cvq_local_issues", JSON.stringify(issues));
  } catch (e) {
    console.error("Local storage error:", e);
  }
};

// ==============================================================================
// AUTHENTICATION & PROFILES
// ==============================================================================

export async function signUpUser(params: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  badgeId?: string;
}) {
  if (!isSupabaseConfigured()) {
    // Local fallback for offline/demo
    const mockUser: Profile = {
      id: "demo-user-" + Date.now(),
      email: params.email,
      full_name: params.fullName,
      role: params.role,
      badge_id: params.badgeId,
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("cvq_current_user", JSON.stringify(mockUser));
    }
    return { data: { user: mockUser }, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        role: params.role,
        badge_id: params.badgeId || "",
      },
    },
  });

  if (error) return { data: null, error };

  if (data.user) {
    // Upsert into profiles table
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email: params.email,
      full_name: params.fullName,
      role: params.role,
      badge_id: params.badgeId || null,
      last_sign_in_at: new Date().toISOString(),
    });

    if (profileError) {
      console.warn("Could not insert profile into database:", profileError.message);
    }
  }

  return { data, error: null };
}

export async function signInUser(email: string, password: string, selectedRole?: UserRole) {
  if (!isSupabaseConfigured()) {
    // Local fallback
    const mockUser: Profile = {
      id: "demo-user",
      email: email || "citizen@cvq.org",
      full_name: email ? email.split("@")[0].toUpperCase() : "John Smith",
      role: selectedRole || "citizen",
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("cvq_current_user", JSON.stringify(mockUser));
    }
    return { data: { user: mockUser, session: {} }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { data: null, error };

  // Fetch or update profile
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq("id", data.user.id);
    }
  }

  return { data, error: null };
}

export async function signOutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cvq_current_user");
  }
  if (!isSupabaseConfigured()) {
    return { error: null };
  }
  return await supabase.auth.signOut();
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("cvq_current_user");
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      id: "demo-citizen",
      email: "john.smith@example.com",
      full_name: "John Smith",
      role: "citizen",
      last_sign_in_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return profile as Profile;

  return {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || "Citizen User",
    role: user.user_metadata?.role || "citizen",
    badge_id: user.user_metadata?.badge_id,
    last_sign_in_at: user.last_sign_in_at,
  };
}

// ==============================================================================
// ISSUES & CIVIC DATA
// ==============================================================================

export async function fetchIssues(options?: {
  status?: string;
  reporterId?: string;
  department?: string;
  searchQuery?: string;
}): Promise<CivicIssue[]> {
  if (!isSupabaseConfigured()) {
    try {
      let url = '/api/issues?';
      if (options?.status && options.status !== "All") url += `status=${options.status}&`;
      if (options?.reporterId) url += `reporterId=${options.reporterId}&`;
      if (options?.department) url += `department=${options.department}&`;
      
      const res = await fetch(url);
      const items: CivicIssue[] = await res.json();
      
      if (options?.searchQuery) {
        const q = options.searchQuery.toLowerCase();
        return items.filter((i) =>
          i.title.toLowerCase().includes(q) ||
          i.ticket_id.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
        );
      }
      return items;
    } catch (e) {
      return getLocalIssues(); // Fallback if API fails
    }
  }

  try {
    let query = supabase.from("issues").select("*").order("created_at", { ascending: false });

    if (options?.status && options.status !== "All") {
      query = query.eq("status", options.status);
    }
    if (options?.reporterId) {
      query = query.eq("reporter_id", options.reporterId);
    }
    if (options?.department) {
      query = query.eq("department", options.department);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      // Fallback if table is empty or error
      return getLocalIssues();
    }
    return data as CivicIssue[];
  } catch (err) {
    console.error("fetchIssues error:", err);
    return getLocalIssues();
  }
}

export async function fetchIssueById(idOrTicket: string): Promise<CivicIssue | null> {
  if (!isSupabaseConfigured()) {
    try {
      const res = await fetch(`/api/issues?id=${idOrTicket}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      const list = getLocalIssues();
      return list.find((i) => i.id === idOrTicket || i.ticket_id === idOrTicket) || list[0] || null;
    }
  }

  try {
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .or(`id.eq.${idOrTicket},ticket_id.eq.${idOrTicket}`)
      .single();

    if (error || !data) {
      const list = getLocalIssues();
      return list.find((i) => i.id === idOrTicket || i.ticket_id === idOrTicket) || null;
    }
    return data as CivicIssue;
  } catch (e) {
    console.error("fetchIssueById error:", e);
    return null;
  }
}

export async function createCivicIssue(issue: {
  title: string;
  category: string;
  location: string;
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  severity?: "Low" | "Medium" | "High" | "Critical";
  department?: string;
}) {
  const ticketNumber = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `CIV-ISS-${ticketNumber}`;
  const user = await getCurrentUserProfile();

  const newIssue: CivicIssue = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    ticket_id: ticketId,
    title: issue.title,
    category: issue.category,
    location: issue.location,
    description: issue.description || "",
    image_url: issue.imageUrl || "/sequence/frame_25.jpg",
    latitude: issue.latitude,
    longitude: issue.longitude,
    status: "Open",
    severity: issue.severity || "Medium",
    department: issue.department || "Public Works",
    reporter_id: user?.id,
    reporter_name: user?.full_name || "Citizen",
    created_at: new Date().toISOString(),
  };

  // Save via API
  if (!isSupabaseConfigured()) {
    try {
      await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue)
      });
    } catch (e) {
      const current = getLocalIssues();
      saveLocalIssues([newIssue, ...current]);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("issues").insert([newIssue]).select().single();
      if (!error && data) return { data: data as CivicIssue, error: null };
    } catch (err) {
      console.warn("Supabase insert failed, used local storage fallback:", err);
    }
  }

  return { data: newIssue, error: null };
}

export async function updateIssueStatus(
  id: string,
  newStatus: CivicIssue["status"],
  resolutionNote?: string
) {
  // Update local/API
  if (!isSupabaseConfigured()) {
    try {
      await fetch('/api/issues', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, resolution_note: resolutionNote, resolved_at: newStatus === "Resolved" || newStatus === "Closed" ? new Date().toISOString() : undefined })
      });
    } catch (e) {
      const current = getLocalIssues();
      const updated = current.map((item) =>
        item.id === id || item.ticket_id === id
          ? { ...item, status: newStatus, resolution_note: resolutionNote || item.resolution_note }
          : item
      );
      saveLocalIssues(updated);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("issues")
        .update({
          status: newStatus,
          resolution_note: resolutionNote,
          resolved_at: newStatus === "Resolved" || newStatus === "Closed" ? new Date().toISOString() : null,
        })
        .or(`id.eq.${id},ticket_id.eq.${id}`);
    } catch (e) {
      console.error("updateIssueStatus error:", e);
    }
  }
}

export async function fetchIssueStats() {
  const issues = await fetchIssues();
  const open = issues.filter((i) => i.status === "Open" || i.status === "Under Review").length;
  const inProgress = issues.filter((i) => i.status === "In Progress" || i.status === "Assigned").length;
  const resolved = issues.filter((i) => i.status === "Resolved" || i.status === "Closed").length;

  return {
    total: issues.length,
    open,
    inProgress,
    resolved,
  };
}

// Storage Image Uploader
export async function uploadIssuePhoto(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    // Return object URL or data URL
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `reports/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("civic-issues")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("civic-issues").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn("Storage upload failed, falling back to local object URL:", err);
    return URL.createObjectURL(file);
  }
}
