import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface Item {
  id: string;
  image: string;
  description: string;
  tags: string[];
  location: string;
}

// In-memory storage (replace with a database in production)
let items: Item[] = [];

export async function GET() {
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem: Item = {
      id: uuidv4(),
      image: body.image,
      description: body.description,
      tags: body.tags,
      location: body.location,
    };
    items.push(newItem);
    return NextResponse.json({ message: "Item posted successfully", item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post item" }, { status: 500 });
  }
}