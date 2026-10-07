import { NextRequest, NextResponse } from 'next/server';
import { enquiryService } from '@/services/enquiry.service';
import { createEnquirySchema } from '@/validations/enquiry.schema';
import { AppError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createEnquirySchema.parse(body);
    const enquiry = await enquiryService.create(validatedData);
    
    return NextResponse.json({ success: true, data: enquiry });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ success: false, error: error.message }, { status: statusCode });
  }
}