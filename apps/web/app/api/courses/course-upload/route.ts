import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // multipart body ongewijzigd doorsturen; geen Content-Type zetten zodat
  // fetch de juiste multipart boundary behoudt.
  const formData = await req.formData();

  const response = await fetch(
    `${process.env.AUTH_API_URL}/courses/course-upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
