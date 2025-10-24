import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("google-site-verification: google8e80767e6782e05e.html", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
