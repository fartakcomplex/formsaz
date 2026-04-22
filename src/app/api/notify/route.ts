import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formTitle, formId, respondent, responses } = body;

    if (!formTitle || !formId) {
      return NextResponse.json(
        { error: 'Missing required fields: formTitle, formId' },
        { status: 400 }
      );
    }

    // Simulated email notification — log to console
    // In production, this would send an actual email via an email service
    console.log('📧 Email Notification:', {
      to: respondent?.email || 'form-owner',
      subject: `پاسخ جدید برای فرم: ${formTitle}`,
      formId,
      formTitle,
      respondent: respondent || 'نامشخص',
      responseCount: responses?.length || 0,
      responses: responses || [],
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
