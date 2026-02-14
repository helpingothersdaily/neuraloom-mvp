(async () => {
  const API = 'http://localhost:5000/api/components';
  const log = (label, obj) => console.log(label, JSON.stringify(obj, null, 2));
  try {
    const r1 = await fetch(API);
    const j1 = await r1.json();
    log('GET initial', j1);

    const payload = { title: 'integration-test-' + new Date().toISOString() };
    const r2 = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const j2 = await r2.json();
    log('POST created', j2);
    const id = j2.data?.id;

    const r3 = await fetch(API);
    const j3 = await r3.json();
    log('GET after create', j3);

    if (id) {
      const r4 = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const j4 = await r4.json();
      log('DELETE response', j4);

      const r5 = await fetch(API);
      const j5 = await r5.json();
      log('GET after delete', j5);
    } else {
      console.log('No id returned from POST, skipping delete');
    }
  } catch (err) {
    console.error('Error during API test:', err);
    process.exit(1);
  }
})();
