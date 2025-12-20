const connector = require('./index');

(async () => {
  try {
    const res = await connector.testConnection();
    if (res.ok) {
      console.log('Supabase OK (conexión establecida)');
    } else {
      console.error('Supabase error:', res.error || 'unknown');
      process.exit(2);
    }
  } catch (err) {
    console.error('Error comprobando Supabase:', err.message || err);
    process.exit(2);
  }
})();
