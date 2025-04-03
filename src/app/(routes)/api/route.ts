export async function GET() {
    return new Response(JSON.stringify({
        message: 'Hello from the server!',
        timestamp: new Date().toISOString(),
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}