
const BASE_URL = process.env.REACT_APP_API_URL;

// ---------------------------
// VOTER AUTH
// ---------------------------
export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  const result = await res.json();
  console.log("API Response:", result); // contains token
  return result; // { token, user: {...} }
};

export const signupUser = async (body) => {
  const res = await fetch(`${BASE_URL}/user/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Signup failed");
  }

  return res.json();
};

// ---------------------------
// CANDIDATES & VOTING
// ---------------------------
  export const getCandidates = async (token) => {
    const res = await fetch(`${BASE_URL}/candidate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.log("TOKEN:", token);
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch candidates");
    }

    return res.json();
  };

export const voteCandidate = async (id, token) => {
  const res = await fetch(`${BASE_URL}/vote/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Voting failed");

  return data;
};

// ---------------------------
// RESULTS
// ---------------------------
export const getResults = async () => {
  const res = await fetch(`${BASE_URL}/vote/count`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch results");
  }

  const data = await res.json();

  // Calculate percentage for each candidate
  const totalVotes = data.reduce((acc, c) => acc + (c.count || 0), 0);
  const resultsWithPercent = data.map((c) => ({
    ...c,
    percentage: totalVotes ? ((c.count / totalVotes) * 100).toFixed(1) : 0,
  }));

  return resultsWithPercent;
};

// ---------------------------
// ADMIN CANDIDATES
// ---------------------------
export const createCandidate = async (candidateData, token) => {
  const res = await fetch(`${BASE_URL}/candidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(candidateData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create candidate");
  }

  return res.json();
};

// ---------------------------
// UPDATE / DELETE CANDIDATES
// ---------------------------
export const updateCandidate = async (id, candidateData, token) => {
  const res = await fetch(`${BASE_URL}/candidate/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(candidateData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update candidate");
  }

  return res.json();
};

export const deleteCandidate = async (id, token) => {
  const res = await fetch(`${BASE_URL}/candidate/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete candidate");
  }

  return res.json();
};
