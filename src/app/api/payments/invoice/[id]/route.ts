import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse } from '@/lib/api-response';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { BID_STATUS, PAYMENT_STATUS } from '@prisma/client';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        statusCode: HttpStatusCode.UNAUTHORIZED
      });
    }

    const paymentId = params.id;
    if (!paymentId) {
      return errorResponse({
        code: 'BAD_REQUEST',
        message: 'Missing payment ID',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: BigInt(paymentId) },
      include: {
        gig: {
          include: {
            user: true,
            bids: {
              where: { status: BID_STATUS.accepted },
              include: {
                provider: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return errorResponse({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Payment not found',
        statusCode: HttpStatusCode.NOT_FOUND
      });
    }

    if (payment.status !== PAYMENT_STATUS.completed) {
      return errorResponse({
        code: 'PAYMENT_NOT_COMPLETED',
        message: 'Payment is not completed',
        statusCode: HttpStatusCode.BAD_REQUEST
      });
    }

    if (payment.gig.user_id !== BigInt(session.user.id)) {
      return errorResponse({
        code: 'FORBIDDEN',
        message: 'You are not authorized to access this invoice',
        statusCode: HttpStatusCode.FORBIDDEN
      });
    }

    const pdfBytes = await generateInvoiceContent(payment);

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="invoice-${paymentId}.pdf"`);

    return new Response(Buffer.from(pdfBytes), {
      headers,
      status: HttpStatusCode.OK
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return errorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to generate invoice',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR
    });
  }
}

async function generateInvoiceContent(payment: { [key: string]: any }): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);

  const { width, height } = page.getSize();
  const fontSizeTitle = 24;
  const fontSizeHeading = 14;
  const fontSizeNormal = 12;
  const fontSizeSmall = 10;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;

  const drawText = (text: string, size = fontSizeNormal, options = {}) => {
    page.drawText(text, {
      x: 50,
      y: y,
      size,
      font: helveticaFont,
      color: rgb(0, 0, 0),
      ...options
    });
    y -= size + 5;
  };

  drawText('INVOICE', fontSizeTitle, { x: width / 2 - 50 });
  y -= 20;

  drawText(`Invoice #: ${payment.id}`);
  drawText(`Date: ${new Date(payment.created_at).toLocaleDateString()}`);
  drawText(`Status: ${payment.status.toUpperCase()}`);
  y -= 10;

  drawText('Bill To:', fontSizeHeading);
  drawText(`Name: ${payment.gig.user.first_name} ${payment.gig.user.last_name}`);
  drawText(`Email: ${payment.gig.user.email}`);
  y -= 10;

  const acceptedBid = payment.gig.bids[0];
  if (acceptedBid) {
    drawText('Service Provider:', fontSizeHeading);
    drawText(`Name: ${acceptedBid.provider.first_name} ${acceptedBid.provider.last_name}`);
    drawText(`Email: ${acceptedBid.provider.email}`);
    y -= 10;
  }

  drawText('Service Details:', fontSizeHeading);
  drawText(`Gig Title: ${payment.gig.title}`);
  drawText(`Description: ${payment.gig.description || 'N/A'}`);
  y -= 10;

  drawText('Payment Details:', fontSizeHeading);
  drawText(`Amount: $${payment.amount}`);
  drawText(`Payment Method: ${payment.payment_method}`);
  drawText(`Transaction ID: ${payment.transaction_id || 'N/A'}`);
  y -= 10;

  drawText('Terms and Conditions:', fontSizeSmall, { underline: true });
  drawText('• This invoice is generated for completed payments only', fontSizeSmall);
  drawText('• Payment is non-refundable once service is completed', fontSizeSmall);
  drawText('• For any disputes, please contact support', fontSizeSmall);
  y -= 10;

  drawText('Thank you for using our platform!', fontSizeSmall, { x: width / 2 - 100 });

  return await pdfDoc.save();
}
