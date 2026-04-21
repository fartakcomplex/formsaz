import type { FormQuestion } from '@/lib/store';

export type TemplateCategory = 'survey' | 'registration' | 'feedback' | 'evaluation' | 'order' | 'education' | 'health' | 'event' | 'hr' | 'other';

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  categoryLabel: string;
  icon: string;
  gradient: string;
  questionCount: number;
  questions: Omit<FormQuestion, 'id'>[];
}

export const templatesData: TemplateData[] = [
  {
    id: 'customer-satisfaction',
    name: 'نظرسنجی رضایت مشتری',
    description: 'سنجش میزان رضایت مشتریان از محصولات و خدمات ارائه‌شده',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'SmilePlus',
    gradient: 'from-rose-400 to-orange-400',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "به طور کلی، چقدر از خدمات ما راضی هستید؟",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کاملاً ناراضی",
                      "scaleMaxLabel": "کاملاً راضی"
                }
          },
          {
                "type": "multiple_choice",
                "title": "چقدر احتمال دارد خدمات ما را به دوستانتان پیشنهاد دهید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "حتماً پیشنهاد می‌دهم"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "احتمالاً پیشنهاد می‌دهم"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مطمئن نیستم"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "احتمالاً پیشنهاد نمی‌دهم"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "به هیچ وجه"
                            }
                      ],
                      "allowOther": true
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "کیفیت محصول/خدمت را چگونه ارزیابی می‌کنید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عالی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ضعیف"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بسیار ضعیف"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا قصد خرید مجدد دارید؟",
                "required": false,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "چه پیشنهادی برای بهبود خدمات ما دارید؟",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد خود را بنویسید...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'nps-survey',
    name: 'نظرسنجی شاخص خالص ترویج‌کنندگان',
    description: 'سنجش میزان وفاداری و تمایل مشتریان به پیشنهاد برند',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'TrendingUp',
    gradient: 'from-violet-400 to-purple-500',
    questionCount: 4,
    questions: [
          {
                "type": "scale",
                "title": "چقدر احتمال دارد نام ما را به دوستانتان پیشنهاد دهید؟",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 0,
                      "scaleMax": 10,
                      "scaleMinLabel": "به هیچ وجه",
                      "scaleMaxLabel": "حتماً"
                }
          },
          {
                "type": "multiple_choice",
                "title": "علت اصلی امتیاز شما چیست؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کیفیت محصولات"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "قیمت مناسب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پشتیبانی عالی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "راحتی استفاده"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "تنوع محصولات"
                            }
                      ],
                      "allowOther": true
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "چقدر از تجربه خرید قبلی خود راضی بودید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بسیار راضی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "راضی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خنثی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ناراضی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بسیار ناراضی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "چه اقدامی می‌توانیم برای بهتر کردن تجربه شما انجام دهیم؟",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 400
                },
                "order": 3
          }
    ],
  },

  {
    id: 'market-research',
    name: 'پرسشنامه تحقیقات بازار',
    description: 'شناخت نیازها، ترجیحات و سلیقه بازار هدف',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'BarChart2',
    gradient: 'from-fuchsia-400 to-pink-500',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "گروه سنی شما",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "زیر ۱۸ سال"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "۱۸ تا ۲۵ سال"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "۲۶ تا ۳۵ سال"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "۳۶ تا ۴۵ سال"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بالای ۴۵ سال"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "از چه طریقی بیشتر خرید می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "فروشگاه آنلاین"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "حضوری در فروشگاه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "تلفنی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "شبکه‌های اجتماعی"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "کدام فاکتورها در خرید شما تأثیر بیشتری دارند؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "قیمت"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کیفیت"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "برند"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "تخفیف و پیشنهاد ویژه"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "نظرات مشتریان"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "ارسال سریع"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "rating",
                "title": "چقدر حاضرید برای محصولات با کیفیت بیشتر هزینه کنید؟",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "اصلاً نه",
                      "scaleMaxLabel": "بسیار زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "چه محصول یا خدماتی دوست دارید در بازار وجود داشته باشد؟",
                "required": false,
                "config": {
                      "placeholder": "ایده یا نیاز خود را بنویسید...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'brand-awareness-survey',
    name: 'نظرسنجی شناخت برند',
    description: 'اندازه‌گیری میزان آشنایی و تصویر ذهنی برند در میان مخاطبان',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Award',
    gradient: 'from-amber-400 to-yellow-500',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "آیا با برند ما آشنایی دارید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، بسیار آشنا"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تا حدودی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "نام را شنیده‌ام"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خیر، آشنا نیستم"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "multiple_select",
                "title": "از چه طریق با برند ما آشنا شدید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "تبلیغات تلویزیونی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "شبکه‌های اجتماعی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "معرفی دوستان"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "جستجوی اینترنتی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "مجلات و روزنامه‌ها"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "در مقایسه با رقبا، برند ما را چگونه می‌بینید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بهتر"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "مشابه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ضعیف‌تر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "نظری ندارم"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "کدام ویژگی‌های برند ما را می‌شناسید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کیفیت بالا"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "قیمت مناسب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خدمات پس از فروش"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "تنوع محصولات"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "نوآوری"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "اولین چیزی که با شنیدن نام برند ما به ذهنتان می‌رسد چیست؟",
                "required": false,
                "config": {
                      "placeholder": "تصویر ذهنی خود را شرح دهید...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'pricing-survey',
    name: 'نظرسنجی قیمت‌گذاری',
    description: 'سنجش دیدگاه مشتریان درباره قیمت محصولات و خدمات',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'DollarSign',
    gradient: 'from-emerald-400 to-green-500',
    questionCount: 4,
    questions: [
          {
                "type": "multiple_choice",
                "title": "قیمت محصولات ما را چگونه ارزیابی می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بسیار ارزان"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "ارزان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "منطقی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "گران"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بسیار گران"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "بیشترین بودجه شما برای خرید این محصول چقدر است؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کمتر از ۵۰۰ هزار تومان"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "۵۰۰ هزار تا ۱ میلیون تومان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "۱ تا ۳ میلیون تومان"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بیش از ۳ میلیون تومان"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا حاضرید برای ویژگی‌های اضافی هزینه بیشتری بپردازید؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "long_text",
                "title": "چه پیشنهادی برای بهبود ساختار قیمت‌گذاری ما دارید؟",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 400
                },
                "order": 3
          }
    ],
  },

  {
    id: 'competitor-analysis-survey',
    name: 'نظرسنجی تحلیل رقبا',
    description: 'شناخت جایگاه برند در مقایسه با رقبا از دیدگاه مشتری',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Users',
    gradient: 'from-cyan-400 to-blue-500',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "معمولاً از کدام برند خرید می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "برند ما"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "برند الف"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "برند ب"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "برند ج"
                            }
                      ],
                      "allowOther": true
                },
                "order": 0
          },
          {
                "type": "multiple_select",
                "title": "دلیل انتخاب برند اصلی خود چیست؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "قیمت مناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کیفیت بالا"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خدمات پس از فروش"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "آشنایی و اعتماد"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "ارائه تخفیف"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "رضایت شما از برند فعلی",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "چه چیزی شما را ترغیب می‌کند برند خود را تغییر دهید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "قیمت بهتر"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کیفیت بالاتر"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خدمات بهتر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "پیشنهاد ویژه"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "معرفی دوستان"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "short_text",
                "title": "برند مورد علاقه شما چیست و چرا؟",
                "required": false,
                "config": {
                      "placeholder": "نام برند و دلیل انتخاب",
                      "maxLength": 200
                },
                "order": 4
          }
    ],
  },

  {
    id: 'social-media-survey',
    name: 'نظرسنجی شبکه‌های اجتماعی',
    description: 'بررسی رفتار و ترجیحات کاربران در شبکه‌های اجتماعی',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Share2',
    gradient: 'from-pink-400 to-rose-500',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "بیشتر از کدام شبکه اجتماعی استفاده می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "اینستاگرام"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تلگرام"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "واتساپ"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "لینکدین"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "تیک‌تاک"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "توییتر"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "number",
                "title": "روزانه چقدر زمان در شبکه‌های اجتماعی می‌گذرانید؟ (ساعت)",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۳",
                      "min": 0,
                      "max": 24
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "بیشتر چه محتوایی را مشاهده می‌کنید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "ویدیو"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "عکس"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متن و مقاله"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "استوری"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "پست‌های آموزشی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "آیا محصولات را از طریق شبکه‌های اجتماعی خرید می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، مرتباً"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گاهی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "به ندرت"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "هرگز"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "چه نوع محتوایی بیشتر جلب توجه شما می‌کند؟",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'email-marketing-feedback',
    name: 'بازخورد ایمیل مارکتینگ',
    description: 'سنجش اثربخشی کمپین‌های ایمیل مارکتینگ',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Mail',
    gradient: 'from-indigo-400 to-blue-600',
    questionCount: 4,
    questions: [
          {
                "type": "multiple_choice",
                "title": "ایمیل‌های ما را چگونه ارزیابی می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بسیار مفید"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "مفید"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خنثی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "غیرمفید"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "آزاردهنده"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "طراحی و ظاهر ایمیل‌ها چقدر جذاب است؟",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "غیرجذاب",
                      "scaleMaxLabel": "بسیار جذاب"
                }
          },
          {
                "type": "multiple_select",
                "title": "ترجیح می‌دهید ایمیل‌ها درباره چه موضوعاتی باشند؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "تخفیف و پیشنهادات"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "محصولات جدید"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مقالات آموزشی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "اخبار شرکت"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "داستان مشتریان"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "چقدر ایمیل‌های ما را باز می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "همیشه"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بیشتر اوقات"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "گاهی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "به ندرت"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "هرگز"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'content-marketing-survey',
    name: 'نظرسنجی بازاریابی محتوایی',
    description: 'سنجش اثربخشی محتوای تولیدی و ترجیحات مخاطبان',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'FileText',
    gradient: 'from-teal-400 to-emerald-500',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "بیشتر چه نوع محتوایی را مطالعه می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مقاله وبلاگ"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "ویدیو"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پادکست"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "اینفوگرافیک"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "کتاب الکترونیکی"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "محتوای ما چقدر برای شما کاربردی بوده است؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بسیار کاربردی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کاربردی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "کمتر کاربردی"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "کیفیت محتوای تولیدی ما را ارزیابی کنید",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "yes_no",
                "title": "آیا محتوای ما باعث شده به خرید از ما ترغیب شوید؟",
                "required": false,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "چه موضوعی دوست دارید در محتوای آینده ما پوشش داده شود؟",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد موضوع...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'website-usability-test',
    name: 'آزمون قابلیت استفاده وب‌سایت',
    description: 'بررسی راحتی استفاده و تجربه کاربری وب‌سایت',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Globe',
    gradient: 'from-sky-400 to-blue-500',
    questionCount: 6,
    questions: [
          {
                "type": "rating",
                "title": "طراحی و ظاهر وب‌سایت",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "سرعت بارگذاری صفحات",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بسیار کند",
                      "scaleMaxLabel": "بسیار سریع"
                }
          },
          {
                "type": "multiple_choice",
                "title": "آیا پیدا کردن اطلاعات مورد نظر در سایت آسان بود؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، بسیار آسان"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تا حدودی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "سخت بود"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "پیدا نکردم"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "کدام بخش‌های سایت نیاز به بهبود دارند؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "منوی ناوبری"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "صفحه اصلی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "فرایند خرید"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "صفحه درباره ما"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بخش پشتیبانی"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا از موبایل از سایت استفاده کرده‌اید؟",
                "required": false,
                "config": {},
                "order": 4
          },
          {
                "type": "long_text",
                "title": "چه مشکلی در استفاده از سایت داشتید؟",
                "required": false,
                "config": {
                      "placeholder": "شرح مشکل...",
                      "maxLength": 400
                },
                "order": 5
          }
    ],
  },

  {
    id: 'app-store-review',
    name: 'بررسی و امتیازدهی اپلیکیشن',
    description: 'جمع‌آوری نظرات و امتیاز کاربران درباره اپلیکیشن',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Smartphone',
    gradient: 'from-lime-400 to-green-500',
    questionCount: 4,
    questions: [
          {
                "type": "rating",
                "title": "امتیاز کلی شما به اپلیکیشن",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "multiple_select",
                "title": "کدام ویژگی‌های اپلیکیشن را بیشتر دوست دارید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "رابط کاربری زیبا"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "سرعت بالا"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "آپدیت منظم"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "امکانات متنوع"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بدون تبلیغات"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا اپلیکیشن ما را به دیگران پیشنهاد می‌دهید؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "long_text",
                "title": "چه ویژگی جدیدی دوست دارید اضافه شود؟",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد شما...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'seo-audit-form',
    name: 'فرم حسابرسی سئو',
    description: 'بررسی و ارزیابی وضعیت سئوی وب‌سایت',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Search',
    gradient: 'from-orange-400 to-red-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "آدرس وب‌سایت خود را وارد کنید",
                "required": true,
                "config": {
                      "placeholder": "https://example.com",
                      "maxLength": 200
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "سرعت بارگذاری سایت شما چگونه است؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بسیار سریع"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "سریع"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "کند"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بسیار کند"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "آیا سایت شما برای موبایل بهینه‌سازی شده است؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، کاملاً"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تا حدودی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خیر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "نمی‌دانم"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "rating",
                "title": "کیفیت محتوای سایت خود را چگونه ارزیابی می‌کنید؟",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "long_text",
                "title": "بزرگترین چالش سئوی سایت شما چیست؟",
                "required": false,
                "config": {
                      "placeholder": "چالش‌های خود را شرح دهید...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'community-survey',
    name: 'نظرسنجی جامعه محلی',
    description: 'جمع‌آوری نظرات شهروندان درباره مسائل جامعه',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Building',
    gradient: 'from-slate-400 to-gray-600',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "محله زندگی شما",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "شمال شهر"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "مرکز شهر"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "جنوب شهر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "شرق شهر"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "غرب شهر"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "بزرگترین مشکل محله شما چیست؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "ترافیک"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "آلودگی هوا"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "نبود فضای سبز"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مشکل حمل‌ونقل عمومی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "امنیت"
                            }
                      ],
                      "allowOther": true
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "رضایت شما از خدمات شهری",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ناراضی",
                      "scaleMaxLabel": "راضی"
                }
          },
          {
                "type": "multiple_select",
                "title": "کدام امکانات را در محله خود بیشتر نیاز دارید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "پارک و فضای سبز"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کتابخانه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "بهدارستانی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مرکز ورزشی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "مدرسه"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "چه تغییری در محله خود دوست دارید ببینید؟",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد شما...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'neighborhood-feedback',
    name: 'بازخورد محله',
    description: 'جمع‌آوری نظرات ساکنان درباره کیفیت زندگی در محله',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Home',
    gradient: 'from-stone-400 to-amber-600',
    questionCount: 4,
    questions: [
          {
                "type": "rating",
                "title": "رضایت کلی از محله زندگی",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "کیفیت معابر و خیابان‌های محله",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عالی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ضعیف"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "امنیت محله",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ناامن",
                      "scaleMaxLabel": "بسیار امن"
                }
          },
          {
                "type": "long_text",
                "title": "توصیه شما برای بهبود محله",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد شما...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'public-transport-survey',
    name: 'نظرسنجی حمل‌ونقل عمومی',
    description: 'بررسی کیفیت و رضایت از سیستم حمل‌ونقل عمومی',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: 'Bus',
    gradient: 'from-blue-400 to-indigo-500',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "بیشتر از چه وسیله نقلیه‌ای استفاده می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مترو"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "اتوبوس"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "تاکسی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خودرو شخصی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "دوچرخه/پیاده"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "رضایت از زمان‌بندی سفرها",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "نامنظم",
                      "scaleMaxLabel": "بسیار منظم"
                }
          },
          {
                "type": "rating",
                "title": "وضعیت بهداشت وسایل نقلیه",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کثیف",
                      "scaleMaxLabel": "بسیار تمیز"
                }
          },
          {
                "type": "multiple_choice",
                "title": "آیا قیمت بلیت مناسب است؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، بسیار مناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "مناسب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "کمی گران"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بسیار گران"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "چه پیشنهادی برای بهبود حمل‌ونقل عمومی دارید؟",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد شما...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'event-registration',
    name: 'فرم ثبت‌نام رویداد',
    description: 'ثبت‌نام شرکت‌کنندگان در رویدادها و همایش‌ها',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'CalendarPlus',
    gradient: 'from-violet-400 to-purple-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل خود را وارد کنید",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن همراه",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "نحوه آشنایی شما با این رویداد",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "شبکه‌های اجتماعی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "ایمیل اطلاع‌رسانی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "معرفی دوستان"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "جستجوی اینترنتی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "سایر"
                            }
                      ],
                      "allowOther": true
                },
                "order": 3
          },
          {
                "type": "multiple_choice",
                "title": "عنوان شغلی شما",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مدیر"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کارمند"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "فریلنسر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "دانشجو"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "صاحب کسب‌وکار"
                            }
                      ],
                      "allowOther": true
                },
                "order": 4
          }
    ],
  },

  {
    id: 'newsletter-signup',
    name: 'ثبت‌نام خبرنامه',
    description: 'عضویت در خبرنامه و دریافت آخرین اخبار و مقالات',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Bell',
    gradient: 'from-rose-400 to-pink-500',
    questionCount: 3,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "موضوعات مورد علاقه شما",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "تکنولوژی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بازاریابی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "طراحی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مدیریت"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "آموزش"
                            }
                      ]
                },
                "order": 2
          }
    ],
  },

  {
    id: 'webinar-registration',
    name: 'ثبت‌نام وبینار',
    description: 'رزرو جای در وبینار و دوره‌های آنلاین',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'MonitorPlay',
    gradient: 'from-blue-400 to-cyan-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": false,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "سطح آشنایی شما با موضوع وبینار",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مبتدی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پیشرفته"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "حرفه‌ای"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'gym-membership',
    name: 'فرم عضویت باشگاه بدنسازی',
    description: 'ثبت‌نام اعضای جدید در باشگاه بدنسازی',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Dumbbell',
    gradient: 'from-orange-400 to-red-500',
    questionCount: 6,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن همراه",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "date",
                "title": "تاریخ تولد",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "هدف اصلی شما از عضویت",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کاهش وزن"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "افزایش عضله"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "حفظ تناسب اندام"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "توانبخشی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "ورزش حرفه‌ای"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا سابقه ورزش منظم دارید؟",
                "required": true,
                "config": {},
                "order": 4
          },
          {
                "type": "dropdown",
                "title": "نوع اشتراک مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "یک ماهه"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "سه ماهه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "شش ماهه"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "سالانه"
                            }
                      ]
                },
                "order": 5
          }
    ],
  },

  {
    id: 'library-membership',
    name: 'فرم عضویت کتابخانه',
    description: 'ثبت‌نام اعضای جدید در کتابخانه',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'BookOpen',
    gradient: 'from-amber-400 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "مقطع تحصیلی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "دانش‌آموز"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کارشناسی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "کارشناسی ارشد"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "دکتری"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "غیره"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "short_text",
                "title": "رشته تحصیلی",
                "required": false,
                "config": {
                      "placeholder": "رشته تحصیلی",
                      "maxLength": 500
                },
                "order": 3
          },
          {
                "type": "multiple_select",
                "title": "نوع کتاب‌های مورد علاقه",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "علمی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "رمان و داستان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "تاریخی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "فلسفی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "هنری"
                            }
                      ]
                },
                "order": 4
          }
    ],
  },

  {
    id: 'volunteering-form',
    name: 'فرم داوطلبی',
    description: 'ثبت‌نام داوطلبان برای فعالیت‌های اجتماعی و خیریه',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Heart',
    gradient: 'from-pink-400 to-red-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن همراه",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "حوزه‌های مورد علاقه برای داوطلبی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "آموزش"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بهداشت و درمان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "محیط زیست"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "کمک به کودکان"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "حمایت از سالمندان"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "multiple_choice",
                "title": "چقدر در هفته زمان برای داوطلبی دارید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "۱ تا ۳ ساعت"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "۳ تا ۵ ساعت"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "۵ تا ۱۰ ساعت"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بیش از ۱۰ ساعت"
                            }
                      ]
                },
                "order": 4
          }
    ],
  },

  {
    id: 'sports-club-membership',
    name: 'فرم عضویت باشگاه ورزشی',
    description: 'ثبت‌نام در باشگاه‌های ورزشی مختلف',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Trophy',
    gradient: 'from-green-400 to-emerald-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "رشته ورزشی مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "فوتبال"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "والیبال"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "بسکتبال"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "شنا"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "تکواندو"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "بدمینتون"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا سابقه بیماری خاصی دارید؟",
                "required": true,
                "config": {},
                "order": 3
          }
    ],
  },

  {
    id: 'rental-application',
    name: 'فرم درخواست اجاره',
    description: 'فرم درخواست اجاره ملک مسکونی یا تجاری',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Key',
    gradient: 'from-yellow-400 to-amber-500',
    questionCount: 6,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی متقاضی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن همراه",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": false,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "نوع ملک مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "آپارتمان"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "ویلایی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "سوئیت"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "دفتر کار"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "مغازه"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "number",
                "title": "بودجه ماهانه شما (میلیون تومان)",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۱۰",
                      "min": 1
                },
                "order": 4
          },
          {
                "type": "long_text",
                "title": "توضیحات تکمیلی",
                "required": false,
                "config": {
                      "placeholder": "موقعیت جغرافیایی، تعداد اتاق و غیره",
                      "maxLength": 300
                },
                "order": 5
          }
    ],
  },

  {
    id: 'school-enrollment',
    name: 'فرم ثبت‌نام مدرسه',
    description: 'ثبت‌نام دانش‌آموزان در مدارس',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'GraduationCap',
    gradient: 'from-indigo-400 to-blue-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی دانش‌آموز",
                "required": true,
                "config": {
                      "placeholder": "نام کامل دانش‌آموز",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی ولی/والده",
                "required": true,
                "config": {
                      "placeholder": "نام کامل ولی",
                      "maxLength": 500
                },
                "order": 1
          },
          {
                "type": "phone",
                "title": "شماره تلفن تماس",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "پایه تحصیلی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "اول"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "دوم"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "سوم"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "چهارم"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "پنجم"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "ششم"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا دانش‌آموز سابقه برگزاری کلاس تابستانی دارد؟",
                "required": false,
                "config": {},
                "order": 4
          }
    ],
  },

  {
    id: 'exam-registration',
    name: 'فرم ثبت‌نام آزمون',
    description: 'ثبت‌نام در آزمون‌های تحصیلی و مهارتی',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'ClipboardList',
    gradient: 'from-purple-400 to-violet-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "short_text",
                "title": "کد ملی",
                "required": true,
                "config": {
                      "placeholder": "کد ملی ۱۰ رقمی",
                      "maxLength": 500
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "آزمون مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کنکور"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "آزمون زبان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "آزمون مهارت"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "آزمون استخدامی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "رشته تحصیلی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "ریاضی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تجربی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "انسانی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "هنر"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "زبان"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'scholarship-application',
    name: 'فرم درخواست بورسیه',
    description: 'درخواست بورسیه تحصیلی و کمک‌هزینه',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Award',
    gradient: 'from-yellow-500 to-orange-500',
    questionCount: 6,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "مقطع تحصیلی فعلی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کارشناسی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کارشناسی ارشد"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "دکتری"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "پسادکتری"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "short_text",
                "title": "رشته و دانشگاه",
                "required": true,
                "config": {
                      "placeholder": "رشته - نام دانشگاه",
                      "maxLength": 500
                },
                "order": 4
          },
          {
                "type": "long_text",
                "title": "چرا این بورسیه را نیاز دارید؟",
                "required": true,
                "config": {
                      "placeholder": "شرح دلایل و شرایط...",
                      "maxLength": 500
                },
                "order": 5
          }
    ],
  },

  {
    id: 'music-lesson-signup',
    name: 'ثبت‌نام آموزش موسیقی',
    description: 'ثبت‌نام در کلاس‌های آموزش موسیقی و ساز',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Music',
    gradient: 'from-purple-500 to-fuchsia-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "ساز مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "پیانو"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گیتار"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ویولن"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "سه‌تار"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "دف"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "تار"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "سطح فعلی نوازندگی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مبتدی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پیشرفته"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'art-class-registration',
    name: 'ثبت‌نام کلاس هنر',
    description: 'ثبت‌نام در دوره‌های نقاشی و هنرهای تجسمی',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Palette',
    gradient: 'from-rose-400 to-fuchsia-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "رشته هنری مورد علاقه",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "نقاشی رنگ روغن"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "آبرنگ"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "طراحی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مجسمه‌سازی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "خوشنویسی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "سطح مهارت هنری",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مبتدی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پیشرفته"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'book-club-registration',
    name: 'ثبت‌نام باشگاه کتاب',
    description: 'عضویت در باشگاه کتاب و گروه مطالعاتی',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'BookMarked',
    gradient: 'from-teal-400 to-cyan-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "ژانرهای مورد علاقه ادبی",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "رمان کلاسیک"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "علمی‌تخیلی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "تاریخی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "فلسفه"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "شعر"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "چقدر در ماه مطالعه می‌کنید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "۱ تا ۲ کتاب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "۳ تا ۴ کتاب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "۵ کتاب یا بیشتر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "به ندرت"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'hiking-club-signup',
    name: 'ثبت‌نام باشگاه کوهنوردی',
    description: 'عضویت در گروه کوهنوردی و طبیعت‌گردی',
    category: 'registration',
    categoryLabel: 'ثبت‌نام',
    icon: 'Mountain',
    gradient: 'from-emerald-500 to-teal-600',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن همراه",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "سطح تجربه کوهنوردی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مبتدی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پیشرفته"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "حرفه‌ای"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا تجهیزات کوهنوردی کامل دارید؟",
                "required": true,
                "config": {},
                "order": 3
          }
    ],
  },

  {
    id: 'product-feedback',
    name: 'نظرسنجی بازخورد محصول',
    description: 'جمع‌آوری نظرات کاربران درباره محصول یا خدمت',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'MessageSquareHeart',
    gradient: 'from-emerald-400 to-teal-500',
    questionCount: 4,
    questions: [
          {
                "type": "multiple_choice",
                "title": "چقدر از این محصول استفاده کرده‌اید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کمتر از یک ماه"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "۱ تا ۳ ماه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "۳ تا ۶ ماه"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بیش از ۶ ماه"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "کاربردی بودن این محصول",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "غیر کاربردی",
                      "scaleMaxLabel": "بسیار کاربردی"
                }
          },
          {
                "type": "multiple_select",
                "title": "کدام ویژگی‌های محصول را بیشتر دوست دارید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "رابط کاربری ساده"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "سرعت بالا"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پشتیبانی خوب"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "قیمت مناسب"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "امکانات متنوع"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "چه ویژگی جدیدی دوست دارید اضافه شود؟",
                "required": false,
                "config": {
                      "placeholder": "ویژگی پیشنهادی خود را شرح دهید...",
                      "maxLength": 500
                },
                "order": 3
          }
    ],
  },

  {
    id: 'restaurant-feedback',
    name: 'بازخورد رستوران',
    description: 'جمع‌آوری نظرات مشتریان رستوران',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'UtensilsCrossed',
    gradient: 'from-red-400 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "کیفیت غذا",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "خدمات رسانی و برخورد پرسنل",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "بهداشت و نظافت محیط",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کثیف",
                      "scaleMaxLabel": "بسیار تمیز"
                }
          },
          {
                "type": "multiple_choice",
                "title": "ارزش غذا در قبال قیمت پرداختی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بسیار مناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "مناسب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "قابل قبول"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "نامناسب"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "پیشنهاد یا انتقاد شما",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'hotel-review',
    name: 'بررسی هتل',
    description: 'نظرسنجی میهمانان هتل درباره کیفیت اقامت',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Bed',
    gradient: 'from-blue-400 to-indigo-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "کیفیت اتاق و امکانات",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "نظافت عمومی هتل",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "برخورد و خدمات پذیرش",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "multiple_choice",
                "title": "صبحانه هتل چگونه بود؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عالی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ضعیف"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "نداشت"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "نظر کلی شما درباره اقامت",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'contact-us',
    name: 'فرم تماس با ما',
    description: 'فرم ارتباط با مشتریان و دریافت پیام‌ها',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Mail',
    gradient: 'from-sky-400 to-cyan-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل خود را وارد کنید",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "موضوع پیام",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "سؤال درباره محصول"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "پشتیبانی فنی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پیشنهاد و انتقاد"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "درخواست همکاری"
                            }
                      ],
                      "allowOther": true
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "متن پیام",
                "required": true,
                "config": {
                      "placeholder": "پیام خود را بنویسید...",
                      "maxLength": 1000
                },
                "order": 3
          }
    ],
  },

  {
    id: 'tenant-feedback',
    name: 'بازخورد مستاجر',
    description: 'جمع‌آوری نظرات مستاجران درباره شرایط اجاره',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Home',
    gradient: 'from-amber-400 to-yellow-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "رضایت کلی از ملک اجاره‌ای",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "وضعیت تعمیرات و نگهداری ملک",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عالی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ضعیف"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا مشکل تأسیسات داشته‌اید؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "برخورد مالک/مدیر ساختمان",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عالی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ضعیف"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "مشکلات یا پیشنهادات شما",
                "required": false,
                "config": {
                      "placeholder": "شرح مشکل...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'veterinary-feedback',
    name: 'بازخورد دامپزشکی',
    description: 'نظرات صاحبان حیوانات درباره خدمات دامپزشکی',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'PawPrint',
    gradient: 'from-green-400 to-lime-500',
    questionCount: 4,
    questions: [
          {
                "type": "rating",
                "title": "کیفیت درمان و تشخیص",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "برخورد و مهربانی با حیوان",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بد",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "multiple_choice",
                "title": "هزینه ویزیت چگونه بود؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کمی بالا"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "زیاد"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بسیار زیاد"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "پیشنهاد یا انتقاد شما",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'food-delivery-feedback',
    name: 'بازخورد سفارش غذا',
    description: 'نظرسنجی درباره تجربه سفارش آنلاین غذا',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Pizza',
    gradient: 'from-orange-400 to-red-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "کیفیت و طعم غذا",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بد",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "سرعت ارسال",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بسیار کند",
                      "scaleMaxLabel": "بسیار سریع"
                }
          },
          {
                "type": "rating",
                "title": "بسته‌بندی سفارش",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "multiple_choice",
                "title": "آیا سفارش دقیق و کامل بود؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، دقیقاً"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تا حدودی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خیر، اشتباه بود"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا دوباره سفارش می‌دهید؟",
                "required": true,
                "config": {},
                "order": 4
          }
    ],
  },

  {
    id: 'charity-feedback',
    name: 'بازخورد خیریه',
    description: 'نظرات حامیان و ذینفعان درباره فعالیت‌های خیریه',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'HeartHandshake',
    gradient: 'from-pink-400 to-rose-500',
    questionCount: 4,
    questions: [
          {
                "type": "rating",
                "title": "شفافیت فعالیت‌های خیریه",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "بسیار بالا"
                }
          },
          {
                "type": "multiple_choice",
                "title": "آیا کمک‌های شما به مقصد رسید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، مطمئنم"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تا حدودی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "نمی‌دانم"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خیر"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا حاضرید دوباره کمک کنید؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای بهبود فعالیت‌های خیریه",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد شما...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'parking-feedback',
    name: 'بازخورد پارکینگ',
    description: 'نظرسنجی درباره کیفیت خدمات پارکینگ',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Car',
    gradient: 'from-gray-400 to-slate-600',
    questionCount: 4,
    questions: [
          {
                "type": "rating",
                "title": "امنیت پارکینگ",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "سهولت ورود و خروج",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "قیمت پارکینگ چگونه است؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کمی گران"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "گران"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "مشکلات یا پیشنهادات شما",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'road-condition-report',
    name: 'گزارش وضعیت جاده',
    description: 'گزارش مشکلات و آسیب‌های جاده‌ای',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'AlertTriangle',
    gradient: 'from-yellow-400 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام خیابان یا محور جاده‌ای",
                "required": true,
                "config": {
                      "placeholder": "نام دقیق",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "نوع مشکل",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "چاله و دست انداز"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "ترک خوردگی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "فقدان تابلو"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "نورپردازی ضعیف"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "سایر"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "شدت مشکل",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کم"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "زیاد"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بحرانی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "date",
                "title": "تاریخ مشاهده مشکل",
                "required": true,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "توضیحات تکمیلی",
                "required": false,
                "config": {
                      "placeholder": "شرح دقیقتر مشکل...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'park-maintenance-request',
    name: 'درخواست نگهداری پارک',
    description: 'گزارش مشکلات و درخواست بهبود فضای سبز',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Trees',
    gradient: 'from-green-400 to-emerald-600',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام پارک",
                "required": true,
                "config": {
                      "placeholder": "نام پارک یا فضای سبز",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "نوع مشکل",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "آبیاری نامناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "هرس نشدن درختان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "آلودگی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "تخریب تجهیزات"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "نبود سطل زباله"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "وضعیت کلی پارک",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بد",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "long_text",
                "title": "توضیحات و پیشنهادات",
                "required": false,
                "config": {
                      "placeholder": "جزئیات بیشتر...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'hiking-trail-feedback',
    name: 'بازخورد مسیر پیاده‌روی',
    description: 'نظرسنجی کوهنوردان درباره مسیرهای پیاده‌روی',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'MapPin',
    gradient: 'from-lime-400 to-green-600',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام مسیر",
                "required": true,
                "config": {
                      "placeholder": "نام مسیر پیاده‌روی",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "وضعیت و علامت‌گذاری مسیر",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بد",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "امنیت مسیر",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای بهبود مسیر",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد شما...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'gardening-tips-feedback',
    name: 'بازخورد نکات باغبانی',
    description: 'نظرسنجی درباره محتوای آموزشی باغبانی',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Flower2',
    gradient: 'from-green-400 to-lime-500',
    questionCount: 4,
    questions: [
          {
                "type": "rating",
                "title": "کیفیت محتوای باغبانی",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "multiple_choice",
                "title": "کدام بخش محتوا کاربردی‌تر بود؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "آبیاری"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کوددهی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "آفات و بیماری‌ها"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "هرس"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "طراحی باغ"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا از توصیه‌ها نتیجه گرفتید؟",
                "required": false,
                "config": {},
                "order": 2
          },
          {
                "type": "long_text",
                "title": "چه موضوعی دوست دارید آموزش داده شود؟",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد موضوع...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'software-feedback',
    name: 'بازخورد نرم‌افزار',
    description: 'نظرات کاربران درباره نرم‌افزار یا اپلیکیشن',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Monitor',
    gradient: 'from-violet-400 to-purple-600',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "راحتی استفاده از نرم‌افزار",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "سرعت و عملکرد",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "چقدر با ویژگی‌های نرم‌افزار آشنا هستید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کاملاً"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بیشتر"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "محدود"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "کمی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "کدام ویژگی‌ها را بیشتر استفاده می‌کنید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "گزارش‌گیری"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تحلیل داده"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "همکاری تیمی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خروجی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "اتوماسیون"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "بگ یا مشکل گزارش کنید",
                "required": false,
                "config": {
                      "placeholder": "شرح مشکل...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'movie-review',
    name: 'بررسی فیلم',
    description: 'نظرسنجی و امتیازدهی به فیلم‌ها',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: 'Film',
    gradient: 'from-red-400 to-pink-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام فیلم",
                "required": true,
                "config": {
                      "placeholder": "نام فیلم",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "امتیاز کلی به فیلم",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 10,
                      "scaleMinLabel": "بدترین",
                      "scaleMaxLabel": "بهترین"
                }
          },
          {
                "type": "rating",
                "title": "کیفیت بازیگران",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "نظر و تحلیل شما درباره فیلم",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 500
                },
                "order": 3
          }
    ],
  },

  {
    id: 'employee-evaluation',
    name: 'ارزیابی عملکرد کارکنان',
    description: 'بررسی عملکرد و شایستگی‌های کارکنان سازمان',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'UserCheck',
    gradient: 'from-amber-400 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی ارزیاب",
                "required": true,
                "config": {
                      "placeholder": "نام کامل ارزیاب",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "کیفیت کار و دقت در انجام وظایف",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "مهارت کار تیمی و همکاری",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "پیشنهاد برای ارتقای شغلی",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "مخالفم",
                      "scaleMaxLabel": "موافقم"
                }
          },
          {
                "type": "long_text",
                "title": "نقاط قوت و حوزه‌های بهبود",
                "required": false,
                "config": {
                      "placeholder": "توضیحات تکمیلی...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'course-evaluation',
    name: 'ارزیابی دوره آموزشی',
    description: 'سنجش کیفیت دوره‌های آموزشی و مدرسان',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'GraduationCap',
    gradient: 'from-indigo-400 to-blue-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "به طور کلی دوره آموزشی",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "کاربردی بودن محتوای دوره",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "غیر کاربردی",
                      "scaleMaxLabel": "بسیار کاربردی"
                }
          },
          {
                "type": "rating",
                "title": "عملکرد مدرس",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "multiple_choice",
                "title": "آیا این دوره را به دیگران پیشنهاد می‌دهید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "حتماً"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "احتمالاً"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مطمئن نیستم"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خیر"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای بهبود دوره",
                "required": false,
                "config": {
                      "placeholder": "پیشنهادات خود را بنویسید...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'performance-review',
    name: 'بررسی عملکرد فصلی',
    description: 'ارزیابی عملکرد کارکنان در بازه زمانی مشخص',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'BarChart3',
    gradient: 'from-emerald-400 to-green-500',
    questionCount: 6,
    questions: [
          {
                "type": "rating",
                "title": "دستیابی به اهداف تعیین‌شده",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "نوآوری و خلاقیت در کار",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "مدیریت زمان و اولویت‌بندی",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "ارتباطات و گزارش‌دهی",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "بزرگترین دستاورد شما در این فصل",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "تکمیل پروژه مهم"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بهبود فرایند"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "آموزش دیگران"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "حل مشکل بحرانی"
                            }
                      ]
                },
                "order": 4
          },
          {
                "type": "long_text",
                "title": "اهداف و برنامه‌های فصل آینده",
                "required": true,
                "config": {
                      "placeholder": "اهداف خود را بنویسید...",
                      "maxLength": 400
                },
                "order": 5
          }
    ],
  },

  {
    id: 'teacher-evaluation',
    name: 'ارزیابی معلم',
    description: 'نظرسنجی دانش‌آموزان درباره عملکرد معلمان',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'School',
    gradient: 'from-blue-400 to-sky-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "تسلط معلم بر موضوع درس",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "قدرت بیان و آموزش",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "رفتار و برخورد با دانش‌آموزان",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "yes_no",
                "title": "آیا معلم از روش‌های متنوع آموزشی استفاده می‌کند؟",
                "required": false,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "نظر و پیشنهاد شما",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'thesis-evaluation',
    name: 'ارزیابی پایان‌نامه',
    description: 'فرم داوری و ارزیابی پایان‌نامه کارشناسی ارشد و دکتری',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'FileCheck',
    gradient: 'from-purple-400 to-violet-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام دانشجو",
                "required": true,
                "config": {
                      "placeholder": "نام و نام خانوادگی",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "short_text",
                "title": "عنوان پایان‌نامه",
                "required": true,
                "config": {
                      "placeholder": "عنوان پایان‌نامه",
                      "maxLength": 500
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "نوآوری و اصالت تحقیق",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "روش‌شناسی و تحلیل",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "تصمیم نهایی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "قبول"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "قبول با اصلاحات جزئی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "قبول با اصلاحات اساسی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مردود"
                            }
                      ]
                },
                "order": 4
          }
    ],
  },

  {
    id: 'workshop-evaluation',
    name: 'ارزیابی کارگاه آموزشی',
    description: 'سنجش کیفیت کارگاه‌های آموزشی کوتاه‌مدت',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'Wrench',
    gradient: 'from-orange-400 to-amber-500',
    questionCount: 4,
    questions: [
          {
                "type": "rating",
                "title": "کیفیت محتوای کارگاه",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "تسلط مدرس و شیوه ارائه",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "مدت زمان کارگاه چگونه بود؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کوتاه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "طولانی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای کارگاه‌های آینده",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد شما...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'fire-safety-audit',
    name: 'حسابرسی ایمنی آتش‌سوزی',
    description: 'بررسی و ارزیابی تجهیزات و اقدامات ایمنی',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'Flame',
    gradient: 'from-red-500 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و آدرس ساختمان",
                "required": true,
                "config": {
                      "placeholder": "نام و آدرس",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "date",
                "title": "تاریخ بازرسی",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا کپسول‌های اطفای حریق موجود و سالم هستند؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا مسیرهای خروج اضطراری مشخص و آزاد هستند؟",
                "required": true,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "مشکلات مشاهده‌شده و اقدامات لازم",
                "required": true,
                "config": {
                      "placeholder": "شرح مشکلات...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'environmental-impact-survey',
    name: 'نظرسنجی تأثیرات زیست‌محیطی',
    description: 'بررسی تأثیرات فعالیت‌ها بر محیط زیست',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'Leaf',
    gradient: 'from-green-500 to-teal-500',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "نوع فعالیت ارزیابی‌شده",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "صنعتی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "کشاورزی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ساختمانی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "تجاری"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "خدماتی"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "میزان آلودگی هوا",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "بسیار بالا"
                }
          },
          {
                "type": "rating",
                "title": "میزان مصرف آب و مدیریت پسماند",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "yes_no",
                "title": "آیا اقدامات حفاظتی انجام شده است؟",
                "required": true,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "پیشنهادات برای کاهش تأثیرات زیست‌محیطی",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'energy-audit-form',
    name: 'فرم حسابرسی انرژی',
    description: 'بررسی مصرف انرژی و شناسایی راه‌های بهینه‌سازی',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'Zap',
    gradient: 'from-yellow-400 to-orange-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و آدرس ساختمان",
                "required": true,
                "config": {
                      "placeholder": "نام و آدرس",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "نوع ساختمان",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مسکونی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تجاری"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "صنعتی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "اداری"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "کیفیت عایق‌بندی ساختمان",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "مشاهدات و پیشنهادات بهینه‌سازی مصرف انرژی",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 400
                },
                "order": 3
          }
    ],
  },

  {
    id: 'it-security-quiz',
    name: 'آزمون آگاهی امنیت فناوری اطلاعات',
    description: 'سنجش دانش کارکنان درباره امنیت اطلاعات',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: 'Shield',
    gradient: 'from-slate-500 to-gray-700',
    questionCount: 5,
    questions: [
          {
                "type": "multiple_choice",
                "title": "آیا رمز عبور خود را به اشتراک می‌گذارید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "هرگز"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گاهی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "معمولاً"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "همیشه"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "آیا روی لینک‌های مشکوک کلیک می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "هرگز"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "به ندرت"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "گاهی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "معمولاً"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا از احراز هویت دو مرحله‌ای استفاده می‌کنید؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "چقدر رمز عبور خود را تغییر می‌دهید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "هر ماه"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "هر سه ماه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "هر شش ماه"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "سالانه"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "مهم‌ترین نکته امنیتی که یاد گرفته‌اید",
                "required": false,
                "config": {
                      "placeholder": "نکته امنیتی...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'online-order',
    name: 'فرم سفارش آنلاین',
    description: 'ثبت سفارشات محصولات به صورت آنلاین',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'ShoppingCart',
    gradient: 'from-lime-400 to-green-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام گیرنده سفارش",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن همراه",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "long_text",
                "title": "آدرس تحویل سفارش",
                "required": true,
                "config": {
                      "placeholder": "آدرس کامل پستی خود را وارد کنید",
                      "maxLength": 300
                },
                "order": 2
          },
          {
                "type": "dropdown",
                "title": "روش پرداخت",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "پرداخت آنلاین"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "پرداخت در محل"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "کارت به کارت"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "توضیحات سفارش",
                "required": false,
                "config": {
                      "placeholder": "مشخصات محصول، تعداد و توضیحات...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'catering-order',
    name: 'فرم سفارش کترینگ',
    description: 'ثبت سفارش خدمات غذا و نوشیدنی برای مراسم',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'Utensils',
    gradient: 'from-orange-400 to-red-500',
    questionCount: 6,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "date",
                "title": "تاریخ مراسم",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "number",
                "title": "تعداد مهمانان",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۵۰",
                      "min": 1
                },
                "order": 3
          },
          {
                "type": "dropdown",
                "title": "نوع غذا",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "ایرانی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "غربی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "سنتی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "گیاهی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "مجموعه"
                            }
                      ]
                },
                "order": 4
          },
          {
                "type": "long_text",
                "title": "توضیحات تکمیلی سفارش",
                "required": false,
                "config": {
                      "placeholder": "جزئیات غذای خاص و...",
                      "maxLength": 300
                },
                "order": 5
          }
    ],
  },

  {
    id: 'pharmacy-order',
    name: 'فرم سفارش دارو',
    description: 'ثبت سفارش دارو و ملزومات پزشکی',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'Pill',
    gradient: 'from-teal-400 to-cyan-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام بیمار",
                "required": true,
                "config": {
                      "placeholder": "نام و نام خانوادگی بیمار",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "long_text",
                "title": "لیست داروهای مورد نیاز",
                "required": true,
                "config": {
                      "placeholder": "نام دقیق داروها و تعداد...",
                      "maxLength": 500
                },
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا نسخه پزشک دارید؟",
                "required": true,
                "config": {},
                "order": 3
          }
    ],
  },

  {
    id: 'car-service-booking',
    name: 'رزرو سرویس خودرو',
    description: 'رزرو تعمیرات و سرویس خودرو',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'Car',
    gradient: 'from-blue-400 to-indigo-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "short_text",
                "title": "نوع و مدل خودرو",
                "required": true,
                "config": {
                      "placeholder": "مثلاً پراید ۱۳۹۸",
                      "maxLength": 500
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "نوع سرویس مورد نیاز",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "تعویض روغن"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تعمیرات جلوبندی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "برق خودرو"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "سرویس دوره‌ای"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "تعمیر موتور"
                            }
                      ],
                      "allowOther": true
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "توضیحات مشکل خودرو",
                "required": false,
                "config": {
                      "placeholder": "شرح مشکل...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'beauty-salon-booking',
    name: 'رزرو سالن زیبایی',
    description: 'رزرو وقت در سالن زیبایی و آرایشگاه',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'Scissors',
    gradient: 'from-pink-400 to-rose-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "خدمات مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کوتاهی مو"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "رنگ مو"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ناخن"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "اصلاح صورت"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "مکرو"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "لیفت ابرو"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "dropdown",
                "title": "ترجیح ساعات",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "صبح"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "ظهر"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "عصر"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'photography-service-booking',
    name: 'رزرو خدمات عکاسی',
    description: 'رزرو عکاس برای مراسم و رویدادها',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'Camera',
    gradient: 'from-violet-400 to-purple-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "date",
                "title": "تاریخ عکاسی",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "نوع عکاسی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عروسی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "جشن تولد"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پورتره"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "تجاری"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "مدرسه"
                            }
                      ],
                      "allowOther": true
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "توضیحات و خواسته‌های خاص",
                "required": false,
                "config": {
                      "placeholder": "جزئیات عکاسی...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'moving-service-request',
    name: 'درخواست خدمات اسباب‌کشی',
    description: 'رزرو شرکت باربری و اسباب‌کشی',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'Truck',
    gradient: 'from-amber-400 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "date",
                "title": "تاریخ اسباب‌کشی",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "تعداد اتاق‌ها",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "یک اتاق"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "دو اتاق"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "سه اتاق یا بیشتر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ویلایی"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "آدرس مبدأ و مقصد",
                "required": true,
                "config": {
                      "placeholder": "آدرس مبدا و مقصد...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'maintenance-request',
    name: 'درخواست تعمیرات و نگهداری',
    description: 'ثبت درخواست تعمیرات و سرویس‌دهی',
    category: 'order',
    categoryLabel: 'سفارش',
    icon: 'Wrench',
    gradient: 'from-gray-400 to-slate-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "نوع خدمات مورد نیاز",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "تعمیرات لوله‌کشی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "برق‌کاری"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "نقاشی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "تعمیرات تهویه"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "سایر"
                            }
                      ],
                      "allowOther": true
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "توضیحات مشکل",
                "required": true,
                "config": {
                      "placeholder": "شرح دقیق مشکل...",
                      "maxLength": 400
                },
                "order": 3
          }
    ],
  },

  {
    id: 'student-course-evaluation',
    name: 'ارزیابی دوره توسط دانشجو',
    description: 'نظرسنجی دانشجویان درباره کیفیت دوره‌های دانشگاهی',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'GraduationCap',
    gradient: 'from-indigo-400 to-blue-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام درس و نام مدرس",
                "required": true,
                "config": {
                      "placeholder": "نام درس - نام مدرس",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "کیفیت تدریس مدرس",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "تناسب امتحان با محتوای آموزشی",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "کتاب منبع چگونه بود؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عالی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ضعیف"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "نداشت"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای بهبود دوره",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'training-needs-assessment',
    name: 'ارزیابی نیازهای آموزشی',
    description: 'شناسایی نیازهای آموزشی کارکنان سازمان',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'Target',
    gradient: 'from-rose-400 to-pink-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "dropdown",
                "title": "بخش سازمانی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "فروش"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بازاریابی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مالی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "منابع انسانی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "فناوری اطلاعات"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "مهارت‌هایی که نیاز به تقویت دارند",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مهارت ارتباطی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "مدیریت زمان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "رهبری"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "زبان انگلیسی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "کار تیمی"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "ترجیح روش آموزش",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "حضوری"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "آنلاین"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ترکیبی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خودخوان"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "اهداف آموزشی شما",
                "required": false,
                "config": {
                      "placeholder": "اهداف...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'homework-submission',
    name: 'فرم تحویل تکلیف',
    description: 'ارسال و ثبت تکالیف دانش‌آموزان و دانشجویان',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'Upload',
    gradient: 'from-sky-400 to-blue-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "short_text",
                "title": "نام درس",
                "required": true,
                "config": {
                      "placeholder": "نام درس",
                      "maxLength": 500
                },
                "order": 1
          },
          {
                "type": "file_upload",
                "title": "فایل تکلیف را آپلود کنید",
                "required": true,
                "config": {
                      "placeholder": "فایل خود را آپلود کنید"
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "توضیحات تکمیلی",
                "required": false,
                "config": {
                      "placeholder": "اگر توضیح اضافه‌ای دارید بنویسید...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'laboratory-safety-checklist',
    name: 'چکلیست ایمنی آزمایشگاه',
    description: 'بررسی رعایت اصول ایمنی در آزمایشگاه',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'FlaskConical',
    gradient: 'from-green-400 to-emerald-500',
    questionCount: 6,
    questions: [
          {
                "type": "short_text",
                "title": "نام آزمایشگاه و مسئول",
                "required": true,
                "config": {
                      "placeholder": "نام و مسئول",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "date",
                "title": "تاریخ بازرسی",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا تجهیزات حفاظتی موجود و سالم هستند؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا دستورالعمل‌های ایمنی نصب شده‌اند؟",
                "required": true,
                "config": {},
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا سیستم تهویه فعال است؟",
                "required": true,
                "config": {},
                "order": 4
          },
          {
                "type": "long_text",
                "title": "مشکلات و اقدامات لازم",
                "required": false,
                "config": {
                      "placeholder": "شرح...",
                      "maxLength": 400
                },
                "order": 5
          }
    ],
  },

  {
    id: 'onboarding-survey',
    name: 'نظرسنجی روز اول کاری',
    description: 'بررسی تجربه کارکنان جدید در روزهای اول کاری',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'UserPlus',
    gradient: 'from-purple-400 to-fuchsia-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "dropdown",
                "title": "بخس سازمانی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "فروش"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بازاریابی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مالی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "منابع انسانی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "فناوری اطلاعات"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "کیفیت فرایند استقرار و معارفه",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "شفافیت انتظارات شغلی",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "سؤالات یا نگرانی‌های شما",
                "required": false,
                "config": {
                      "placeholder": "سؤالات خود را بنویسید...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'parent-feedback',
    name: 'بازخورد والدین',
    description: 'نظرسنجی والدین درباره وضعیت تحصیلی فرزندان',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'Users',
    gradient: 'from-amber-400 to-yellow-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی ولی",
                "required": true,
                "config": {
                      "placeholder": "نام والدین",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "short_text",
                "title": "نام و کلاس فرزند",
                "required": true,
                "config": {
                      "placeholder": "نام و پایه تحصیلی",
                      "maxLength": 500
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "رضایت از کیفیت آموزش مدرسه",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "رضایت از برخورد معلمان",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "پیشنهاد یا انتقاد شما",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'fitness-assessment',
    name: 'ارزیابی آمادگی جسمانی',
    description: 'بررسی سطح آمادگی جسمانی ورزشکاران',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'Activity',
    gradient: 'from-red-400 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "number",
                "title": "قد (سانتی‌متر)",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۱۷۵",
                      "min": 100,
                      "max": 220
                },
                "order": 1
          },
          {
                "type": "number",
                "title": "وزن (کیلوگرم)",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۷۰",
                      "min": 30,
                      "max": 200
                },
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "سطح فعالیت فعلی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بدون فعالیت"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "فعالیت سبک"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "فعالیت متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "فعالیت سنگین"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "اهداف ورزشی شما",
                "required": false,
                "config": {
                      "placeholder": "اهداف...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'nutrition-plan',
    name: 'برنامه تغذیه',
    description: 'طراحی برنامه غذایی متناسب با نیازها',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'Apple',
    gradient: 'from-green-400 to-lime-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "number",
                "title": "سن",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۲۵",
                      "min": 10,
                      "max": 100
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "سطح فعالیت بدنی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کم"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "زیاد"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "حرفه‌ای"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "حساسیت‌های غذایی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "لبنیات"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گلوتن"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "آجیل"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "غذاهای دریایی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "ندارم"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "multiple_choice",
                "title": "هدف از برنامه تغذیه",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کاهش وزن"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "افزایش وزن"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "حفظ وزن"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "سلامتی عمومی"
                            }
                      ]
                },
                "order": 4
          }
    ],
  },

  {
    id: 'recipe-rating',
    name: 'امتیازدهی دستور غذا',
    description: 'نظرسنجی درباره دستور پخت غذاها',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'ChefHat',
    gradient: 'from-orange-400 to-amber-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام غذا",
                "required": true,
                "config": {
                      "placeholder": "نام دستور غذا",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "طعم و مزه غذا",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بد",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "سادگی تهیه",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "تغییرات یا پیشنهاد شما در دستور پخت",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'book-review',
    name: 'بررسی کتاب',
    description: 'نظرسنجی و نقد کتاب‌ها',
    category: 'education',
    categoryLabel: 'آموزش',
    icon: 'BookOpen',
    gradient: 'from-teal-400 to-cyan-600',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام کتاب و نویسنده",
                "required": true,
                "config": {
                      "placeholder": "نام کتاب - نویسنده",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "rating",
                "title": "امتیاز کلی به کتاب",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 10,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "سبک نگارش نویسنده",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "نقد و نظر شما درباره کتاب",
                "required": false,
                "config": {
                      "placeholder": "نظر خود را بنویسید...",
                      "maxLength": 500
                },
                "order": 3
          }
    ],
  },

  {
    id: 'health-questionnaire',
    name: 'پرسشنامه سلامت عمومی',
    description: 'بررسی وضعیت عمومی سلامت بیماران',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'Heart',
    gradient: 'from-red-400 to-pink-500',
    questionCount: 6,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "date",
                "title": "تاریخ تولد",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "وضعیت فعلی سلامت عمومی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ضعیف"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "بیماری‌های زمینه‌ای",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "دیابت"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "فشار خون"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "قلبی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "آسم"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "ندارم"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا داروی خاصی مصرف می‌کنید؟",
                "required": true,
                "config": {},
                "order": 4
          },
          {
                "type": "long_text",
                "title": "توضیحات تکمیلی درباره وضعیت سلامت",
                "required": false,
                "config": {
                      "placeholder": "شرح...",
                      "maxLength": 400
                },
                "order": 5
          }
    ],
  },

  {
    id: 'dental-clinic-form',
    name: 'فرم کلینیک دندانپزشکی',
    description: 'فرم اولیه مراجعه به کلینیک دندانپزشکی',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'Smile',
    gradient: 'from-cyan-400 to-blue-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "date",
                "title": "تاریخ آخرین ویزیت دندانپزشکی",
                "required": false,
                "config": {},
                "order": 2
          },
          {
                "type": "multiple_choice",
                "title": "دلیل مراجعه",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "معاینه"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "درد دندان"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "جراحی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "زیبایی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "پاکسازی"
                            }
                      ],
                      "allowOther": true
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا حساسیت دارویی خاصی دارید؟",
                "required": true,
                "config": {},
                "order": 4
          }
    ],
  },

  {
    id: 'pet-vaccination-form',
    name: 'فرم واکسیناسیون حیوان خانگی',
    description: 'ثبت اطلاعات واکسیناسیون حیوانات خانگی',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'PawPrint',
    gradient: 'from-amber-400 to-orange-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام صاحب حیوان",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "نوع حیوان",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "سگ"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گربه"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "پرنده"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خرگوش"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "همستر"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "short_text",
                "title": "نام حیوان و سن تقریبی",
                "required": true,
                "config": {
                      "placeholder": "نام و سن",
                      "maxLength": 500
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا واکسیناسیون قبلی انجام شده است؟",
                "required": true,
                "config": {},
                "order": 4
          }
    ],
  },

  {
    id: 'mental-health-screening',
    name: 'غربالگری سلامت روان',
    description: 'فرم اولیه بررسی سلامت روان',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'Brain',
    gradient: 'from-purple-400 to-violet-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "در دو هفته اخیر، چقدر احساس اضطراب داشته‌اید؟",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "اصلاً",
                      "scaleMaxLabel": "بسیار زیاد"
                }
          },
          {
                "type": "rating",
                "title": "چقدر احساس غم و افسردگی داشته‌اید؟",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "اصلاً",
                      "scaleMaxLabel": "بسیار زیاد"
                }
          },
          {
                "type": "rating",
                "title": "کیفیت خواب شما",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "بسیار بد",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "yes_no",
                "title": "آیا مشکل تمرکز دارید؟",
                "required": false,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "اگر دوست دارید درباره وضعیت خود توضیح دهید",
                "required": false,
                "config": {
                      "placeholder": "توضیحات...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'stress-management-survey',
    name: 'نظرسنجی مدیریت استرس',
    description: 'بررسی سطح استرس و روش‌های مقابله',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'CloudRain',
    gradient: 'from-gray-400 to-blue-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "سطح استرس فعلی شما",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "بسیار بالا"
                }
          },
          {
                "type": "multiple_choice",
                "title": "عامل اصلی استرس شما",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کار"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تحصیل"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "روابط خانوادگی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مشکلات مالی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بیماری"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "روش‌های مقابله با استرس",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "ورزش"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "مدیتیشن"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "صحبت با دوستان"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "موسیقی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "هیچکدام"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا به کمک حرفه‌ای نیاز دارید؟",
                "required": true,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "شرح شرایط و نگرانی‌های خود",
                "required": false,
                "config": {
                      "placeholder": "توضیحات...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'sleep-quality-survey',
    name: 'نظرسنجی کیفیت خواب',
    description: 'بررسی عادات و کیفیت خواب',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'Moon',
    gradient: 'from-indigo-400 to-purple-500',
    questionCount: 5,
    questions: [
          {
                "type": "number",
                "title": "به طور متوسط چند ساعت در شب می‌خوابید؟",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۷",
                      "min": 1,
                      "max": 16
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "کیفیت خواب خود را چگونه ارزیابی می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "عالی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "خوب"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ضعیف"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "yes_no",
                "title": "آیا مشکل بی‌خوابی دارید؟",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "عوامل مزاحم خواب",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "استرس"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "نور و صدا"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "تلفن همراه"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "کافئین"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بیماری"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "توضیحات تکمیلی",
                "required": false,
                "config": {
                      "placeholder": "شرح...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'allergy-information-form',
    name: 'فرم اطلاعات حساسیت',
    description: 'ثبت اطلاعات حساسیت‌های دارویی و غذایی',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'ShieldAlert',
    gradient: 'from-red-400 to-orange-600',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "date",
                "title": "تاریخ تولد",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "حساسیت‌های دارویی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "پنی‌سیلین"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "سولفا"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "آسپرین"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "ایبروپروفن"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "ندارم"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "حساسیت‌های غذایی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "آجیل"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "شیر"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "تخم مرغ"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "گلوتن"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "غذاهای دریایی"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "ندارم"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'blood-donation-form',
    name: 'فرم اهدای خون',
    description: 'فرم ثبت‌نام اهداکنندگان خون',
    category: 'health',
    categoryLabel: 'سلامت',
    icon: 'Droplets',
    gradient: 'from-rose-500 to-red-600',
    questionCount: 6,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "date",
                "title": "تاریخ تولد",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "dropdown",
                "title": "گروه خونی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "A+"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "A-"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "B+"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "B-"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "AB+"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "AB-"
                            },
                            {
                                  "id": "opt-6",
                                  "text": "O+"
                            },
                            {
                                  "id": "opt-7",
                                  "text": "O-"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "yes_no",
                "title": "آیا در سه ماه گذشته اهدا کرده‌اید؟",
                "required": true,
                "config": {},
                "order": 4
          },
          {
                "type": "yes_no",
                "title": "آیا بیماری خاصی دارید؟",
                "required": true,
                "config": {},
                "order": 5
          }
    ],
  },

  {
    id: 'conference-feedback',
    name: 'بازخورد کنفرانس',
    description: 'نظرسنجی شرکت‌کنندگان درباره کنفرانس',
    category: 'event',
    categoryLabel: 'رویداد',
    icon: 'Mic',
    gradient: 'from-blue-400 to-indigo-500',
    questionCount: 5,
    questions: [
          {
                "type": "rating",
                "title": "کیفیت کلی کنفرانس",
                "required": true,
                "order": 0,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "ضعیف",
                      "scaleMaxLabel": "عالی"
                }
          },
          {
                "type": "rating",
                "title": "ارائه‌دهندگان و سخنرانان",
                "required": true,
                "order": 1,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "rating",
                "title": "سازماندهی و مدیریت زمان",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "multiple_choice",
                "title": "آیا کنفرانس را به دیگران پیشنهاد می‌دهید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "حتماً"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "احتمالاً"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مطمئن نیستم"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "خیر"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای کنفرانس‌های آینده",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'wedding-rsvp',
    name: 'فرم پاسخ به دعوت عروسی',
    description: 'ثبت حضور در مراسم عروسی',
    category: 'event',
    categoryLabel: 'رویداد',
    icon: 'Heart',
    gradient: 'from-pink-400 to-rose-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "آیا در مراسم حضور خواهید داشت؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله حتماً"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متأسفانه نمی‌توانم"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "number",
                "title": "تعداد همراهان",
                "required": false,
                "config": {
                      "placeholder": "تعداد نفرات",
                      "min": 0,
                      "max": 5
                },
                "order": 2
          },
          {
                "type": "multiple_select",
                "title": "رژیم غذایی خاص",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بدون محدودیت"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گیاهی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "بدون گلوتن"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بدون لبنیات"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "بدون آجیل"
                            }
                      ]
                },
                "order": 3
          }
    ],
  },

  {
    id: 'birthday-party-planning',
    name: 'فرم برنامه‌ریزی جشن تولد',
    description: 'جمع‌آوری اطلاعات برای برگزاری جشن تولد',
    category: 'event',
    categoryLabel: 'رویداد',
    icon: 'Cake',
    gradient: 'from-purple-400 to-fuchsia-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام فرد تولد",
                "required": true,
                "config": {
                      "placeholder": "نام",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "date",
                "title": "تاریخ تولد",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "number",
                "title": "تعداد مهمانان",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۲۰",
                      "min": 1
                },
                "order": 2
          },
          {
                "type": "dropdown",
                "title": "نوع کیک",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "شکلاتی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "میوه‌ای"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "وافل"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "شکلات تلخ"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "ساده"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "درخواست‌های خاص",
                "required": false,
                "config": {
                      "placeholder": "درخواست‌های شما...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'camping-reservation',
    name: 'فرم رزرو کمپینگ',
    description: 'رزرو محل و تجهیزات کمپینگ',
    category: 'event',
    categoryLabel: 'رویداد',
    icon: 'Tent',
    gradient: 'from-green-400 to-emerald-600',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "date",
                "title": "تاریخ شروع کمپینگ",
                "required": true,
                "config": {},
                "order": 2
          },
          {
                "type": "number",
                "title": "تعداد نفرات",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۴",
                      "min": 1
                },
                "order": 3
          }
    ],
  },

  {
    id: 'facility-booking',
    name: 'فرم رزرو سالن',
    description: 'رزرو سالن‌های همایش، آموزش و ورزشی',
    category: 'event',
    categoryLabel: 'رویداد',
    icon: 'DoorOpen',
    gradient: 'from-cyan-400 to-blue-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "نوع سالن",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "همایش"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "آموزشی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ورزشی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "جلسه"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "date",
                "title": "تاریخ مورد نظر",
                "required": true,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "توضیحات و درخواست‌های خاص",
                "required": false,
                "config": {
                      "placeholder": "جزئیات...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'it-support-ticket',
    name: 'تیکت پشتیبانی فناوری اطلاعات',
    description: 'ثبت درخواست پشتیبانی فنی',
    category: 'event',
    categoryLabel: 'رویداد',
    icon: 'Headphones',
    gradient: 'from-gray-500 to-slate-600',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل کاری",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "اولویت مشکل",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بالا"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "متوسط"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "کم"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "شرح مشکل فنی",
                "required": true,
                "config": {
                      "placeholder": "مشکل را شرح دهید...",
                      "maxLength": 500
                },
                "order": 3
          }
    ],
  },

  {
    id: 'real-estate-inquiry',
    name: 'فرم استعلام املاک',
    description: 'ثبت درخواست مشاوره و جستجوی ملک',
    category: 'event',
    categoryLabel: 'رویداد',
    icon: 'Building',
    gradient: 'from-yellow-400 to-amber-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "نوع ملک مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "آپارتمان مسکونی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "ویلایی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "زمین"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مغازه"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "دفتر"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "number",
                "title": "بودجه (میلیون تومان)",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۵۰۰۰"
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "موقعیت جغرافیایی و مشخصات دلخواه",
                "required": false,
                "config": {
                      "placeholder": "محله، متراژ و...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'job-application',
    name: 'فرم درخواست شغل',
    description: 'فرم درخواست استخدام و ثبت رزومه',
    category: 'hr',
    categoryLabel: 'منابع انسانی',
    icon: 'Briefcase',
    gradient: 'from-blue-400 to-indigo-500',
    questionCount: 7,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 2
          },
          {
                "type": "dropdown",
                "title": "موقعیت شغلی مورد نظر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "برنامه‌نویس"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "طراح"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مدیر پروژه"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بازاریاب"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "مالی"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "منابع انسانی"
                            }
                      ]
                },
                "order": 3
          },
          {
                "type": "multiple_choice",
                "title": "سابقه کار",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بدون سابقه"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "۱ تا ۳ سال"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "۳ تا ۵ سال"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بیش از ۵ سال"
                            }
                      ]
                },
                "order": 4
          },
          {
                "type": "long_text",
                "title": "درباره خودتان و تجربیاتتان بنویسید",
                "required": true,
                "config": {
                      "placeholder": "خلاصه رزومه...",
                      "maxLength": 500
                },
                "order": 5
          },
          {
                "type": "file_upload",
                "title": "فایل رزومه را آپلود کنید",
                "required": false,
                "config": {
                      "placeholder": "فایل خود را آپلود کنید"
                },
                "order": 6
          }
    ],
  },

  {
    id: 'exit-interview',
    name: 'مصاحبه خروج',
    description: 'نظرسنجی کارکنان در هنگام ترک سازمان',
    category: 'hr',
    categoryLabel: 'منابع انسانی',
    icon: 'LogOut',
    gradient: 'from-rose-400 to-pink-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "dropdown",
                "title": "بخش سازمانی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "فروش"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بازاریابی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مالی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "منابع انسانی"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "فناوری اطلاعات"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "دلیل اصلی ترک کار",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "حقوق نامناسب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "فرصت‌های شغلی بهتر"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "محیط نامناسب"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مهاجرت"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "تحصیل"
                            }
                      ],
                      "allowOther": true
                },
                "order": 2
          },
          {
                "type": "rating",
                "title": "رضایت کلی از دوران حضور در سازمان",
                "required": true,
                "order": 3,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای بهبود سازمان",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },

  {
    id: 'volunteer-hours-log',
    name: 'ثبت ساعات داوطلبی',
    description: 'ثبت و پیگیری ساعات فعالیت‌های داوطلبانه',
    category: 'hr',
    categoryLabel: 'منابع انسانی',
    icon: 'Clock',
    gradient: 'from-teal-400 to-cyan-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "date",
                "title": "تاریخ فعالیت",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "number",
                "title": "تعداد ساعات فعالیت",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۳",
                      "min": 1
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "شرح فعالیت انجام‌شده",
                "required": true,
                "config": {
                      "placeholder": "توضیحات فعالیت...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'legal-consultation',
    name: 'فرم مشاوره حقوقی',
    description: 'ثبت درخواست مشاوره حقوقی',
    category: 'hr',
    categoryLabel: 'منابع انسانی',
    icon: 'Scale',
    gradient: 'from-slate-500 to-gray-700',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": false,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "شرح مطلب حقوقی",
                "required": true,
                "config": {
                      "placeholder": "مشکل یا سؤال حقوقی خود را شرح دهید...",
                      "maxLength": 500
                },
                "order": 3
          }
    ],
  },

  {
    id: 'notary-service-form',
    name: 'فرم خدمات دفتر اسناد',
    description: 'ثبت درخواست خدمات دفتر اسناد رسمی',
    category: 'hr',
    categoryLabel: 'منابع انسانی',
    icon: 'FileSignature',
    gradient: 'from-amber-400 to-orange-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "نوع خدمات",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "تنظیم سند"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "اخذ گواهی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ترجمه رسمی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "مهر و امضا"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "توضیحات",
                "required": false,
                "config": {
                      "placeholder": "جزئیات...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'patent-application',
    name: 'فرم درخواست ثبت اختراع',
    description: 'ثبت درخواست برای ثبت اختراع',
    category: 'hr',
    categoryLabel: 'منابع انسانی',
    icon: 'Lightbulb',
    gradient: 'from-yellow-400 to-amber-500',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی مخترع",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "email",
                "title": "آدرس ایمیل",
                "required": true,
                "config": {
                      "placeholder": "example@email.com"
                },
                "order": 1
          },
          {
                "type": "phone",
                "title": "شماره تلفن",
                "required": true,
                "config": {
                      "placeholder": "۰۹۱۲۳۴۵۶۷۸۹"
                },
                "order": 2
          },
          {
                "type": "short_text",
                "title": "عنوان اختراع",
                "required": true,
                "config": {
                      "placeholder": "عنوان اختراع",
                      "maxLength": 500
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "شرح اختراع",
                "required": true,
                "config": {
                      "placeholder": "شرح کامل اختراع و نوآوری آن...",
                      "maxLength": 500
                },
                "order": 4
          }
    ],
  },

  {
    id: 'copyright-registration',
    name: 'فرم ثبت حق نشر',
    description: 'ثبت درخواست حق نشر اثر ادبی یا هنری',
    category: 'hr',
    categoryLabel: 'منابع انسانی',
    icon: 'FileLock',
    gradient: 'from-violet-400 to-purple-500',
    questionCount: 4,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی صاحب اثر",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "dropdown",
                "title": "نوع اثر",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کتاب"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "موسیقی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "فیلم"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "نرم‌افزار"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "نقاشی"
                            },
                            {
                                  "id": "opt-5",
                                  "text": "سایر"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "short_text",
                "title": "عنوان اثر",
                "required": true,
                "config": {
                      "placeholder": "عنوان اثر",
                      "maxLength": 500
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "شرح مختصر اثر",
                "required": true,
                "config": {
                      "placeholder": "توضیحات...",
                      "maxLength": 400
                },
                "order": 3
          }
    ],
  },

  {
    id: 'grocery-shopping-list',
    name: 'لیست خرید خواربار',
    description: 'ثبت سفارش و لیست خرید مواد غذایی',
    category: 'other',
    categoryLabel: 'سایر',
    icon: 'ShoppingBag',
    gradient: 'from-green-400 to-lime-500',
    questionCount: 3,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام کامل",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "long_text",
                "title": "لیست خرید خود را بنویسید",
                "required": true,
                "config": {
                      "placeholder": "مواد غذایی مورد نیاز...",
                      "maxLength": 500
                },
                "order": 1
          },
          {
                "type": "dropdown",
                "title": "روش دریافت",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "ارسال به آدرس"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "تحویل حضوری"
                            }
                      ]
                },
                "order": 2
          }
    ],
  },

  {
    id: 'meal-planning-survey',
    name: 'نظرسنجی برنامه‌ریزی غذا',
    description: 'بررسی عادات غذایی و ترجیحات غذایی خانواده',
    category: 'other',
    categoryLabel: 'سایر',
    icon: 'UtensilsCrossed',
    gradient: 'from-orange-400 to-red-500',
    questionCount: 5,
    questions: [
          {
                "type": "number",
                "title": "تعداد اعضای خانواده",
                "required": true,
                "config": {
                      "placeholder": "مثلاً ۴",
                      "min": 1
                },
                "order": 0
          },
          {
                "type": "multiple_choice",
                "title": "نوع غذای اصلی خانواده",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "ایرانی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "غربی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "مجموعه"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "گیاهی"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "multiple_select",
                "title": "مواد غذایی مورد علاقه",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "مرغ"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گوشت قرمز"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "ماهی"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "حبوبات"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "سبزیجات"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "yes_no",
                "title": "آیا محدودیت غذایی خاصی دارید؟",
                "required": false,
                "config": {},
                "order": 3
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای وعده‌های غذایی",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 300
                },
                "order": 4
          }
    ],
  },

  {
    id: 'waste-management-survey',
    name: 'نظرسنجی مدیریت پسماند',
    description: 'بررسی روش‌های دفع و بازیافت زباله',
    category: 'other',
    categoryLabel: 'سایر',
    icon: 'Recycle',
    gradient: 'from-green-500 to-emerald-600',
    questionCount: 4,
    questions: [
          {
                "type": "multiple_choice",
                "title": "روش اصلی دفع زباله خانگی",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "سطل زباله عمومی"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "بازیافت"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "کمپوست"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "سوزاندن"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "yes_no",
                "title": "آیا زباله‌ها را تفکیک می‌کنید؟",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "multiple_choice",
                "title": "بزرگترین مشکل دفع زباله در منطقه شما",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "نداشتن سطل بازیافت"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "عدم آموزش"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "نداشتن سیستم جمع‌آوری"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "بی‌توجهی شهروندان"
                            }
                      ]
                },
                "order": 2
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای بهبود مدیریت پسماند",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'recycling-feedback',
    name: 'بازخورد بازیافت',
    description: 'نظرسنجی درباره برنامه‌های بازیافت',
    category: 'other',
    categoryLabel: 'سایر',
    icon: 'Leaf',
    gradient: 'from-teal-400 to-green-500',
    questionCount: 4,
    questions: [
          {
                "type": "multiple_choice",
                "title": "آیا در برنامه بازیافت محله شرکت می‌کنید؟",
                "required": true,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "بله، فعال"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "گاهی"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "خیر"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "برنامه‌ای وجود ندارد"
                            }
                      ]
                },
                "order": 0
          },
          {
                "type": "multiple_select",
                "title": "کدام مواد را بازیافت می‌کنید؟",
                "required": false,
                "config": {
                      "options": [
                            {
                                  "id": "opt-0",
                                  "text": "کاغذ"
                            },
                            {
                                  "id": "opt-1",
                                  "text": "پلاستیک"
                            },
                            {
                                  "id": "opt-2",
                                  "text": "شیشه"
                            },
                            {
                                  "id": "opt-3",
                                  "text": "فلز"
                            },
                            {
                                  "id": "opt-4",
                                  "text": "باتری"
                            }
                      ]
                },
                "order": 1
          },
          {
                "type": "rating",
                "title": "رضایت از سیستم بازیافت محله",
                "required": true,
                "order": 2,
                "config": {
                      "scaleMin": 1,
                      "scaleMax": 5,
                      "scaleMinLabel": "کم",
                      "scaleMaxLabel": "زیاد"
                }
          },
          {
                "type": "long_text",
                "title": "پیشنهاد برای بهبود",
                "required": false,
                "config": {
                      "placeholder": "پیشنهاد...",
                      "maxLength": 300
                },
                "order": 3
          }
    ],
  },

  {
    id: 'wildlife-observation',
    name: 'فرم مشاهده حیات وحش',
    description: 'ثبت مشاهدات حیات وحش توسط طبیعت‌گردان',
    category: 'other',
    categoryLabel: 'سایر',
    icon: 'Bird',
    gradient: 'from-emerald-400 to-teal-600',
    questionCount: 5,
    questions: [
          {
                "type": "short_text",
                "title": "نام و نام خانوادگی",
                "required": true,
                "config": {
                      "placeholder": "نام مشاهده‌کننده",
                      "maxLength": 500
                },
                "order": 0
          },
          {
                "type": "date",
                "title": "تاریخ مشاهده",
                "required": true,
                "config": {},
                "order": 1
          },
          {
                "type": "short_text",
                "title": "نام مکان مشاهده",
                "required": true,
                "config": {
                      "placeholder": "موقعیت جغرافیایی",
                      "maxLength": 500
                },
                "order": 2
          },
          {
                "type": "short_text",
                "title": "نوع حیوان مشاهده‌شده",
                "required": true,
                "config": {
                      "placeholder": "نام گونه",
                      "maxLength": 500
                },
                "order": 3
          },
          {
                "type": "long_text",
                "title": "توضیحات تکمیلی (رفتار، تعداد و غیره)",
                "required": false,
                "config": {
                      "placeholder": "جزئیات...",
                      "maxLength": 400
                },
                "order": 4
          }
    ],
  },
];
