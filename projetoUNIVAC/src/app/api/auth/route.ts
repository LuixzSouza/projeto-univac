// # Lida com login (Fazer_Login)

import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    return NextResponse.json({ message: "API Auth: Handler GET placeholder." }, { status: 200 });
}


export async function POST(request: Request) {
    return NextResponse.json({ message: "API Auth: Handler POST placeholder." }, { status: 200 });
}
