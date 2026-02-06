import React from "react";

export default function ReplitAuth() {
  return (
    <div className="flex gap-2">
      <a href="/replit/login/" className="btn">
        Login with Replit
      </a>
      <a href="/replit/logout/" className="btn">
        Logout
      </a>
    </div>
  );
}
