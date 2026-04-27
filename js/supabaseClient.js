const SUPABASE_URL = "https://grecfmjshkomahhlnuua.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZWNmbWpzaGtvbWFoaGxudXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjg5MzgsImV4cCI6MjA5MTg0NDkzOH0.liinewHw1RNp2ZAXqMGJRXZ0AIYsrKL4wVINwCh50Jw";

// Initialize the Supabase client and assign it to the global window object
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
