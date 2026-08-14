import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validasi input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nama, email, dan pesan harus diisi' },
        { status: 400 }
      );
    }

    // Simpan pesan ke Supabase
    try {
      const { data, error } = await supabase.from('contacts').insert([
        {
          name: name,
          email: email,
          message: message,
        },
      ]).select();

      if (error) {
        throw error;
      }

      console.log('Contact message saved:', data);
    } catch (supabaseError) {
      console.error('Failed to save to Supabase:', supabaseError);
      return NextResponse.json(
        { 
          error: 'Gagal menyimpan pesan. Silakan coba lagi.'
        },
        { status: 500 }
      );
    }

    // Response sukses
    return NextResponse.json(
      { 
        success: true, 
        message: 'Pesan berhasil disimpan! Silakan kirim melalui WhatsApp juga untuk memastikan tersampaikan.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in send-contact:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
