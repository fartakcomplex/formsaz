import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

const DEFAULT_SETTINGS = {
  siteName: 'فرمساز',
  siteDescription: 'ساخت فرم‌های آنلاین حرفه‌ای',
  allowRegistration: true,
  maxFormsPerUser: 50,
  maxQuestionsPerForm: 100,
  maintenanceMode: false,
  defaultFormTheme: {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    fontFamily: 'Vazirmatn',
  },
};

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, create it with defaults
    await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    return DEFAULT_SETTINGS;
  }
}

async function writeSettings(settings: Record<string, unknown>) {
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت تنظیمات' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const currentSettings = await readSettings();

    const updatedSettings = { ...currentSettings, ...body };
    await writeSettings(updatedSettings);

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: 'خطا در بروزرسانی تنظیمات' }, { status: 500 });
  }
}
