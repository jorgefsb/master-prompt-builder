// Supabase Configuration
const SUPABASE_URL = 'https://dbdbbudbwslfcxnxxyqf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_igUl6aY0bSUOGhj0uF67Sg_4Pl9-twM';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Lead Capture Function
 */
export async function saveLead(email, source = 'landing') {
    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([{ email, source, created_at: new Date() }]);

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error('Error saving lead:', err);
        return { success: false, error: err };
    }
}
