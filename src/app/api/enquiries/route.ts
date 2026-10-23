import { NextRequest, NextResponse } from 'next/server';
import { enquiryService } from '@/services/enquiry.service';
import { createEnquirySchema } from '@/validations/enquiry.schema';
import { AppError } from '@/lib/errors';
import { enforceRateLimit } from '@/lib/rate-limit';
import { z } from 'zod/v4';

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, 'enquiry:create', 3, 300);
  if (limited) return limited;

  try {
    const body = await req.json();
    const validatedData = createEnquirySchema.parse(body);
    const enquiry = await enquiryService.create(validatedData);
    
    return NextResponse.json({ success: true, data: enquiry });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid enquiry' }, { status: 400 });
    }
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    if (!(error instanceof AppError)) console.error('Enquiry creation failed', error);
    return NextResponse.json({ success: false, error: error instanceof AppError ? error.message : 'Unable to submit enquiry' }, { status: statusCode });
  }
}
