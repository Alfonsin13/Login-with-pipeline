import { NextResponse } from "next/server";

export async function GET(req: Request){
  return NextResponse.json({ message: "Api en funcionamiento" }, { status: 200 });
}