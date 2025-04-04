import * as htmlPdf from 'html-pdf-chrome';
import sharp from 'sharp';

export async function POST(req: Request, res: Response) {
  try {
    const {
        vehicle,
        driver,
        ticketSeller,
        operator,
        stamp
    } = await req.json();
    
    // Generate the PDF from HTML
    const htmlContent = `
        <html>
        <head><title>Document</title></head>
        <body>
          <h1>Transport Report</h1>
          <table>
            <tr>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Ticket Seller</th>
              <th>Operator</th>
            </tr>
            <tr>
              <td>ABC123</td>
              <td>John Doe</td>
              <td>Jane Smith</td>
              <td>James Brown</td>
            </tr>
            <!-- Add more rows as needed -->
          </table>
        </body>
      </html>
    `;

    // Create PDF
    const pdf = await htmlPdf.create(htmlContent);
    const pdfBuffer = await pdf.toBuffer();

    // Convert PDF to image using sharp
    const imageBuffer = await sharp(pdfBuffer)
      .resize(800) // Resize the image to fit the desired dimensions
      .toFormat('png')
      .toBuffer();

    // Set the response headers for image download
    const headers = new Headers({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename=document.png',
    });

    // Send the image as the response
    return new Response(imageBuffer, { status: 200, headers });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500 },
    );
  }
}
