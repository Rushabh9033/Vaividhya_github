import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../config/api";

function AdminEventLevel() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [teamFilter, setTeamFilter] = useState("ALL");

    useEffect(() => {
        fetch(`${API.BASE}/api/admin/event-level-registrations`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filtered = data.filter(row => {
        const matchesSearch = row.full_name.toLowerCase().includes(search.toLowerCase()) ||
            row.enrollment_no.toLowerCase().includes(search.toLowerCase()) ||
            row.event_name.toLowerCase().includes(search.toLowerCase());

        const matchesTeam = teamFilter === "ALL" || row.approved_by === teamFilter;
        return matchesSearch && matchesTeam;
    });

    const exportToCSV = () => {
        const headers = ["Name,Enrollment,Phone,Event,Category,Price,PayDate,Status,ApprovedBy\n"];
        const rows = filtered.map(r =>
            `"${r.full_name}","${r.enrollment_no}","${r.phone}","${r.event_name}","${r.event_category}",${r.price},"${r.approved_at || r.register_date}","${r.payment_status}","${r.approved_by || ''}"`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_level_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    return (
        <>
            <Navbar />
            <div className="admin-container" style={{ padding: "100px 20px", color: "white", minHeight: "80vh" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h1 style={{ color: "#00e5ff" }}>Event-Level View</h1>
                    <button
                        onClick={exportToCSV}
                        style={{ padding: "10px 20px", background: "#22c55e", border: "none", color: "white", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Export CSV 📥
                    </button>
                </div>

                <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                    <input
                        placeholder="Search name, enrollment or event..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                    />
                    <select
                        value={teamFilter}
                        onChange={e => setTeamFilter(e.target.value)}
                        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#1e293b", color: "white" }}
                    >
                        <option value="ALL">All Teams</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i} value={`TEAM${i + 1}`}>Team {i + 1}</option>
                        ))}
                    </select>
                </div>

                {loading ? <p>Loading registrations...</p> : (
                    <div style={{ overflowX: "auto", background: "#0f172a", borderRadius: "10px", padding: "10px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #334155", color: "#64748b" }}>
                                    <th style={{ padding: "12px" }}>Name</th>
                                    <th style={{ padding: "12px" }}>Event</th>
                                    <th style={{ padding: "12px" }}>Price</th>
                                    <th style={{ padding: "12px" }}>Status</th>
                                    <th style={{ padding: "12px" }}>Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                                        <td style={{ padding: "12px" }}>{row.full_name}</td>
                                        <td style={{ padding: "12px", color: "#00e5ff" }}>{row.event_name}</td>
                                        <td style={{ padding: "12px" }}>₹{row.price}</td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "0.8rem",
                                                background: row.payment_status === "PAID" ? "#064e3b" : "#450a0a",
                                                color: row.payment_status === "PAID" ? "#34d399" : "#fb7185"
                                            }}>
                                                {row.payment_status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px", color: "#94a3b8" }}>{row.approved_by || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default AdminEventLevel;
