import { NextRequest, NextResponse } from "next/server";
import { registerSchemaBase } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { ...dataForBackend } = body;

    const validatedData = registerSchemaBase.parse(dataForBackend);

    const response = await fetch(`${process.env.AUTH_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { success: false, message: responseText || "Server error" },
        { status: response.status },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Registratie mislukt",
          // Conflict-code (EMAIL_TAKEN / DISPLAY_NAME_TAKEN) voor veld-fouten.
          code: data.code,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { success: true, message: "Account aangemaakt", userId: data.id },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validatiefout",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Er ging iets mis" },
      { status: 500 },
    );
  }
}
