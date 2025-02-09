import DbConnect from "@/db/Connectdb";
import Data from "@/Models/Data";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await DbConnect();
    const { input, output, image, priority } = await req.json();

    // Check for duplicate entry
    const existingEntry = await Data.findOne({
      image: image
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "Duplicate entry not allowed." },
        { status: 409 } // Conflict status
      );
    }

    // Create and save new entry
    const newRow = new Data({ input, output, image, priority });
    await newRow.save();

    return NextResponse.json(
      { message: "Row Added", newRow },
      { status: 201 } // 201 Created status
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await DbConnect();
    const Datas = await Data.find({});
    return NextResponse.json(JSON.stringify({ message: "Le mil gya", Datas }), { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json( JSON.stringify({message : "Nhi Degi"}), {status : 400} );
  }
}